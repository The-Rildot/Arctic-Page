import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CharacterCreatorModal } from "./components/CharacterCreatorModal";
import { CustomCharacter as CustomCharacterView } from "./components/CustomCharacter";
import { CharacterView } from "./components/character/CharacterView";
import { SceneBackground } from "./components/backgrounds/SceneBackground";
import { DEFAULT_SCENE_ID, isSceneId, SCENE_PRESETS, type SceneId } from "./constants/scenes";
import { BEAR_PRESET, PENGUIN_PRESET } from "./constants/builtInCharacters";
import { MAX_CUSTOM_CHARACTERS, createDefaultComponents } from "./constants/characterCreator";
import { BASE_CHARACTER_DEFAULTS, CHARACTER_SIZES, clampAllCharacterPositions } from "./constants/motion";
import { useCharacterMotion } from "./hooks/useCharacterMotion";
import type { CharacterComponentKey, CustomCharacter } from "./types/characters";
import {
  buildPlaygroundExport,
  buildShareUrl,
  parsePlaygroundImport,
  readSharePayloadFromHash,
  type PlaygroundExportV1
} from "./utils/playgroundExport";
import { DEFAULT_BUILT_IN_CHARACTER_NAMES, storage } from "./utils/storage";

type CharacterDraft = {
  name: string;
  messageText: string;
  components: CustomCharacter["components"];
};

const createDefaultDraft = (): CharacterDraft => ({
  name: "",
  messageText: "",
  components: createDefaultComponents()
});

function App() {
  const [isNightMode, setIsNightMode] = useState(() => storage.getNightMode());
  const [selectedScene, setSelectedScene] = useState<SceneId>(() => storage.getSelectedScene());
  const [customCharacters, setCustomCharacters] = useState<CustomCharacter[]>(() =>
    storage.getCustomCharacters()
  );
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [characterDraft, setCharacterDraft] = useState<CharacterDraft>(() => createDefaultDraft());
  const [creatorError, setCreatorError] = useState("");
  const [selectedCustomCharacterId, setSelectedCustomCharacterId] = useState<string | null>(null);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [showCharacterNames, setShowCharacterNames] = useState(() => storage.getShowCharacterNames());
  const [builtInCharacterNames, setBuiltInCharacterNames] = useState(() => storage.getBuiltInCharacterNames());
  const [settingsMessage, setSettingsMessage] = useState("");
  const importSettingsInputRef = useRef<HTMLInputElement>(null);

  const modeLabel = useMemo(() => (isNightMode ? "Night Mode" : "Day Mode"), [isNightMode]);
  const customCharacterIds = useMemo(() => customCharacters.map((character) => character.id), [customCharacters]);
  const {
    characterPositions,
    setCharacterPositions,
    draggingCharacterId,
    startDrag,
    nudgeCharacter,
    suppressSelectRef
  } = useCharacterMotion({
    customCharacterIds,
    initialPositions: storage.getCharacterPositions()
  });

  const applyPlaygroundSnapshot = useCallback(
    (snap: PlaygroundExportV1) => {
      const ids = snap.customCharacters.map((c) => c.id);
      const draggableIds = ["penguin", "bear", ...ids];
      setIsNightMode(snap.isNightMode);
      setSelectedScene(snap.selectedScene);
      setShowCharacterNames(snap.showCharacterNames);
      setBuiltInCharacterNames(snap.builtInCharacterNames);
      setCustomCharacters(snap.customCharacters);
      setCharacterPositions(clampAllCharacterPositions(snap.characterPositions, draggableIds, ids));
      setSelectedCustomCharacterId(null);
      setEditingCharacterId(null);
      setCreatorError("");
    },
    [setCharacterPositions]
  );
  const startCharacterDrag = useMemo(
    () =>
      (id: string, size: { width: number; height: number }) =>
        startDrag(id, size, (dragId) => setSelectedCustomCharacterId((prev) => (dragId === prev ? prev : null))),
    [startDrag]
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isNightMode);
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [isNightMode]);

  useEffect(() => {
    storage.setNightMode(isNightMode);
  }, [isNightMode]);

  useEffect(() => {
    const scene = selectedScene || DEFAULT_SCENE_ID;
    storage.setSelectedScene(scene);
    document.body.dataset.scene = scene;
  }, [selectedScene]);

  useEffect(() => {
    storage.setCustomCharacters(customCharacters);
  }, [customCharacters]);

  useEffect(() => {
    storage.setCharacterPositions(characterPositions);
  }, [characterPositions]);

  useEffect(() => {
    storage.setShowCharacterNames(showCharacterNames);
  }, [showCharacterNames]);

  useEffect(() => {
    storage.setBuiltInCharacterNames(builtInCharacterNames);
  }, [builtInCharacterNames]);

  useEffect(() => {
    if (!settingsMessage) {
      return;
    }
    const timer = window.setTimeout(() => setSettingsMessage(""), 5000);
    return () => window.clearTimeout(timer);
  }, [settingsMessage]);

  useEffect(() => {
    const snap = readSharePayloadFromHash(window.location.hash);
    if (!snap) {
      return;
    }
    const frame = requestAnimationFrame(() => {
      applyPlaygroundSnapshot(snap);
      setSettingsMessage("Loaded settings from link.");
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    });
    return () => cancelAnimationFrame(frame);
  }, [applyPlaygroundSnapshot]);

  const handleModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsNightMode(event.target.checked);
  };

  const closeCreatorModal = useCallback(() => {
    setIsCreatorOpen(false);
  }, []);

  const handleResetCustomCharacters = () => {
    setCustomCharacters([]);
    setCharacterPositions({ ...BASE_CHARACTER_DEFAULTS });
    setSelectedCustomCharacterId(null);
    setEditingCharacterId(null);
    storage.resetCustomCharacters();
  };

  const handleOpenCreator = () => {
    if (customCharacters.length >= MAX_CUSTOM_CHARACTERS) {
      setCreatorError(`You can only create ${MAX_CUSTOM_CHARACTERS} custom characters.`);
      return;
    }
    setCreatorError("");
    setCharacterDraft(createDefaultDraft());
    setEditingCharacterId(null);
    setIsCreatorOpen(true);
  };

  const handleSaveCharacter = () => {
    if (!editingCharacterId && customCharacters.length >= MAX_CUSTOM_CHARACTERS) {
      setCreatorError(`You can only create ${MAX_CUSTOM_CHARACTERS} custom characters.`);
      return;
    }

    const trimmedName = characterDraft.name.trim();
    if (editingCharacterId) {
      setCustomCharacters((prev) =>
        prev.map((character) =>
          character.id === editingCharacterId
            ? {
                ...character,
                name: trimmedName || character.name,
                messageText: characterDraft.messageText,
                components: characterDraft.components
              }
            : character
        )
      );
      setSelectedCustomCharacterId(editingCharacterId);
      setEditingCharacterId(null);
    } else {
      const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `custom-${Date.now()}`;
      const position = { x: 220 + customCharacters.length * 140, y: 220 };
      const newCharacter: CustomCharacter = {
        id,
        type: "custom",
        name: trimmedName || `Custom ${customCharacters.length + 1}`,
        position,
        messageText: characterDraft.messageText,
        components: characterDraft.components
      };

      setCustomCharacters((prev) => [...prev, newCharacter]);
      setCharacterPositions((prev) => ({
        ...prev,
        [newCharacter.id]: position
      }));
      setSelectedCustomCharacterId(newCharacter.id);
    }

    setIsCreatorOpen(false);
    setCreatorError("");
  };

  const handleEditCharacter = (id: string) => {
    const character = customCharacters.find((item) => item.id === id);
    if (!character) {
      return;
    }
    setCharacterDraft({
      name: character.name,
      messageText: character.messageText,
      components: character.components
    });
    setEditingCharacterId(id);
    setCreatorError("");
    setIsCreatorOpen(true);
  };

  const handleDeleteCharacter = (id: string) => {
    setCustomCharacters((prev) => prev.filter((character) => character.id !== id));
    setCharacterPositions((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSelectedCustomCharacterId((prev) => (prev === id ? null : prev));
    setEditingCharacterId((prev) => (prev === id ? null : prev));
  };

  const handleExportSettings = () => {
    const snap = buildPlaygroundExport({
      isNightMode,
      selectedScene,
      customCharacters,
      characterPositions,
      showCharacterNames,
      builtInCharacterNames
    });
    const blob = new Blob([JSON.stringify(snap, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "arctic-page-settings.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setSettingsMessage("Exported settings file.");
  };

  const handleCopyShareLink = async () => {
    const snap = buildPlaygroundExport({
      isNightMode,
      selectedScene,
      customCharacters,
      characterPositions,
      showCharacterNames,
      builtInCharacterNames
    });
    const url = buildShareUrl(snap);
    if (!url) {
      setSettingsMessage("Layout too large for a share link. Use Export instead.");
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setSettingsMessage("Share link copied to clipboard.");
    } catch {
      setSettingsMessage("Could not copy to clipboard.");
    }
  };

  const handleImportSettingsClick = () => {
    importSettingsInputRef.current?.click();
  };

  const handleImportSettingsFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      const snap = parsePlaygroundImport(parsed);
      if (!snap) {
        setSettingsMessage("Invalid or unsupported settings file.");
        return;
      }
      applyPlaygroundSnapshot(snap);
      setSettingsMessage("Imported settings.");
    } catch {
      setSettingsMessage("Could not read JSON file.");
    }
  };

  const updateDraftComponent = (key: CharacterComponentKey, updates: Partial<CustomCharacter["components"][CharacterComponentKey]>) => {
    setCharacterDraft((prev) => ({
      ...prev,
      components: {
        ...prev.components,
        [key]: {
          ...prev.components[key],
          ...updates
        }
      }
    }));
  };

  useEffect(() => {
    const handlePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      if (target.closest(".character-instance") || target.closest(".character-action-controls")) {
        return;
      }
      setSelectedCustomCharacterId(null);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <>
      <SceneBackground sceneId={selectedScene} isNightMode={isNightMode} />
      <CharacterView
        className={`character-instance draggable-character${draggingCharacterId === "penguin" ? " dragging" : ""}`}
        components={PENGUIN_PRESET}
        messageText="I CSS"
        shirtEmoji="💜"
        position={characterPositions.penguin ?? BASE_CHARACTER_DEFAULTS.penguin}
        nameLabel={
          builtInCharacterNames.penguin.trim() || DEFAULT_BUILT_IN_CHARACTER_NAMES.penguin
        }
        showNameLabel={showCharacterNames}
        characterId="penguin"
        onArrowKeyNudge={nudgeCharacter}
        onPointerDown={startCharacterDrag("penguin", CHARACTER_SIZES.base)}
      />
      <CharacterView
        className={`character-instance draggable-character${draggingCharacterId === "bear" ? " dragging" : ""}`}
        components={BEAR_PRESET}
        messageText="I HTML"
        shirtEmoji="💖"
        position={characterPositions.bear ?? BASE_CHARACTER_DEFAULTS.bear}
        nameLabel={builtInCharacterNames.bear.trim() || DEFAULT_BUILT_IN_CHARACTER_NAMES.bear}
        showNameLabel={showCharacterNames}
        characterId="bear"
        onArrowKeyNudge={nudgeCharacter}
        onPointerDown={startCharacterDrag("bear", CHARACTER_SIZES.base)}
      />

      {customCharacters.map((character) => (
        <div key={character.id}>
          <CustomCharacterView
            character={character}
            position={characterPositions[character.id] ?? character.position}
            showNameLabel={showCharacterNames}
            onArrowKeyNudge={nudgeCharacter}
            onPointerDown={startCharacterDrag(character.id, CHARACTER_SIZES.custom)}
            onPointerUp={() => {
              if (suppressSelectRef.current === character.id) {
                suppressSelectRef.current = null;
                return;
              }
              setSelectedCustomCharacterId(character.id);
            }}
            isDragging={draggingCharacterId === character.id}
          />
          {selectedCustomCharacterId === character.id && draggingCharacterId !== character.id ? (
            <div
              className="character-action-controls"
              role="group"
              aria-label={`Actions for ${character.name}`}
              style={{
                left: (characterPositions[character.id] ?? character.position).x + 12,
                top: (characterPositions[character.id] ?? character.position).y - 36
              }}
            >
              <button type="button" className="rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-white" onClick={() => handleEditCharacter(character.id)}>
                Edit
              </button>
              <button type="button" className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white" onClick={() => handleDeleteCharacter(character.id)}>
                Delete
              </button>
            </div>
          ) : null}
        </div>
      ))}
      <header className="switch-container" role="region" aria-label="Playground controls">
        <span className="sr-only">
          Tip: Tab to a character, then use arrow keys to nudge its position without dragging.
        </span>
        <label className="switch" htmlFor="mode-switch">
          <span className="sr-only">Toggle day or night mode. Currently: {modeLabel}.</span>
          <input type="checkbox" id="mode-switch" checked={isNightMode} onChange={handleModeChange} />
          <span className="slider" aria-hidden="true" />
        </label>
        <span id="mode-label" aria-hidden="true">
          {modeLabel}
        </span>
        <label
          htmlFor="toggle-show-names"
          className="ml-2 flex cursor-pointer items-center gap-2 rounded bg-white/80 px-2 py-1 text-sm text-slate-700"
        >
          <input
            id="toggle-show-names"
            type="checkbox"
            checked={showCharacterNames}
            onChange={(event) => setShowCharacterNames(event.target.checked)}
          />
          Show names
        </label>
        {showCharacterNames ? (
          <>
            <label className="flex items-center gap-1.5 rounded bg-white/80 px-2 py-1 text-xs text-slate-700">
              <span className="whitespace-nowrap font-medium">Penguin</span>
              <input
                type="text"
                className="w-[7.5rem] max-w-[28vw] rounded border border-slate-300 px-1.5 py-0.5 text-sm"
                value={builtInCharacterNames.penguin}
                onChange={(event) =>
                  setBuiltInCharacterNames((prev) => ({ ...prev, penguin: event.target.value }))
                }
                maxLength={48}
                aria-label="Display name for Penguin"
              />
            </label>
            <label className="flex items-center gap-1.5 rounded bg-white/80 px-2 py-1 text-xs text-slate-700">
              <span className="whitespace-nowrap font-medium">Polar bear</span>
              <input
                type="text"
                className="w-[7.5rem] max-w-[28vw] rounded border border-slate-300 px-1.5 py-0.5 text-sm"
                value={builtInCharacterNames.bear}
                onChange={(event) =>
                  setBuiltInCharacterNames((prev) => ({ ...prev, bear: event.target.value }))
                }
                maxLength={48}
                aria-label="Display name for Polar Bear"
              />
            </label>
          </>
        ) : null}
        <button type="button" className="ml-4 rounded bg-slate-800 px-3 py-2 text-sm text-white" onClick={handleResetCustomCharacters}>
          Reset Custom Characters
        </button>
        <button type="button" className="ml-2 rounded bg-sky-700 px-3 py-2 text-sm text-white" onClick={handleOpenCreator}>
          Create Character
        </button>
        <button
          type="button"
          className="ml-2 rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          onClick={handleExportSettings}
        >
          Export
        </button>
        <button
          type="button"
          className="ml-2 rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          onClick={handleImportSettingsClick}
        >
          Import
        </button>
        <input
          ref={importSettingsInputRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Import playground settings from JSON file"
          onChange={handleImportSettingsFile}
        />
        <button
          type="button"
          className="ml-2 rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          onClick={() => void handleCopyShareLink()}
        >
          Copy share link
        </button>
        <label htmlFor="scene-select" className="ml-2 flex items-center gap-2 rounded bg-white/80 px-2 py-1 text-sm text-slate-700">
          Scene
          <select
            id="scene-select"
            className="rounded border border-slate-300 px-2 py-1 text-sm"
            value={selectedScene}
            onChange={(event) => {
              const value = event.target.value;
              if (isSceneId(value)) {
                setSelectedScene(value);
              }
            }}
          >
            {SCENE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </label>
        {creatorError ? (
          <span className="ml-3 text-sm font-medium text-red-600" role="alert">
            {creatorError}
          </span>
        ) : null}
        {settingsMessage ? (
          <span className="ml-3 text-sm font-medium text-emerald-800" role="status" aria-live="polite">
            {settingsMessage}
          </span>
        ) : null}
      </header>

      <CharacterCreatorModal
        isOpen={isCreatorOpen}
        draft={characterDraft}
        title={editingCharacterId ? "Edit Character" : "Character Creator"}
        saveLabel={editingCharacterId ? "Save Changes" : "Save Character"}
        onClose={closeCreatorModal}
        onSave={handleSaveCharacter}
        onNameChange={(value) => setCharacterDraft((prev) => ({ ...prev, name: value }))}
        onMessageChange={(value) => setCharacterDraft((prev) => ({ ...prev, messageText: value }))}
        onComponentVariantChange={(key, variantId) => updateDraftComponent(key, { variantId })}
        onComponentColorChange={(key, color) => updateDraftComponent(key, { color })}
      />
    </>
  );
}

export default App;
