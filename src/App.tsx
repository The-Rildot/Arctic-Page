import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CharacterCreatorModal } from "./components/CharacterCreatorModal";
import { ControlPanel } from "./components/ControlPanel";
import { CustomCharacter as CustomCharacterView } from "./components/CustomCharacter";
import { CharacterView } from "./components/character/CharacterView";
import { SceneBackground } from "./components/backgrounds/SceneBackground";
import { DEFAULT_SCENE_ID, SCENE_PRESETS, isSceneId, type SceneId } from "./constants/scenes";
import { BEAR_PRESET, PENGUIN_PRESET } from "./constants/builtInCharacters";
import { MAX_CUSTOM_CHARACTERS, createDefaultComponents } from "./constants/characterCreator";
import { BASE_CHARACTER_DEFAULTS, clampAllCharacterPositions, getCenteredCharacterPosition, DESKTOP_CHARACTER_PX } from "./constants/motion";
import { useCharacterMotion } from "./hooks/useCharacterMotion";
import { usePlaygroundCharacterSize } from "./hooks/usePlaygroundCharacterSize";
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
  components: CustomCharacter["components"];
};

const createDefaultDraft = (): CharacterDraft => ({
  name: "",
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
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [showCharacterNames, setShowCharacterNames] = useState(() => storage.getShowCharacterNames());
  const [builtInCharacterNames, setBuiltInCharacterNames] = useState(() => storage.getBuiltInCharacterNames());
  const [settingsMessage, setSettingsMessage] = useState("");
  const [lockedCharacterIds, setLockedCharacterIds] = useState<string[]>(() =>
    storage.getLockedCharacterIds()
  );
  const importSettingsInputRef = useRef<HTMLInputElement>(null);
  const playgroundCharacterSize = usePlaygroundCharacterSize();

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
    initialPositions: storage.getCharacterPositions(),
    lockedCharacterIds
  });

  const applyPlaygroundSnapshot = useCallback(
    (snap: PlaygroundExportV1) => {
      const ids = snap.customCharacters.map((c) => c.id);
      const draggableIds = ["penguin", "bear", ...ids];
      const validIds = new Set(draggableIds);
      setIsNightMode(snap.isNightMode);
      setSelectedScene(snap.selectedScene);
      setShowCharacterNames(snap.showCharacterNames);
      setBuiltInCharacterNames(snap.builtInCharacterNames);
      setCustomCharacters(snap.customCharacters);
      setCharacterPositions(clampAllCharacterPositions(snap.characterPositions, draggableIds, ids));
      setLockedCharacterIds(snap.lockedCharacterIds.filter((id) => validIds.has(id)));
      setSelectedCharacterId(null);
      setEditingCharacterId(null);
      setCreatorError("");
    },
    [setCharacterPositions]
  );
  const startCharacterDrag = useMemo(
    () =>
      (id: string, size: { width: number; height: number }) =>
        startDrag(id, size, (dragId) => setSelectedCharacterId((prev) => (dragId === prev ? prev : null))),
    [startDrag]
  );

  const isCharacterLocked = useCallback(
    (id: string) => lockedCharacterIds.includes(id),
    [lockedCharacterIds]
  );

  const toggleCharacterLock = useCallback((id: string) => {
    setLockedCharacterIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const handleSelectByPointerUp = useCallback(
    (id: string) => {
      if (suppressSelectRef.current === id) {
        suppressSelectRef.current = null;
        return;
      }
      setSelectedCharacterId(id);
    },
    [suppressSelectRef]
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
    storage.setLockedCharacterIds(lockedCharacterIds);
  }, [lockedCharacterIds]);

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

  useEffect(() => {
    if (isCreatorOpen) {
      return;
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.querySelector<HTMLElement>(".switch-container--mobile-sheet")?.scrollTo(0, 0);
  }, [isCreatorOpen]);

  const handleModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsNightMode(event.target.checked);
  };

  const handleSceneChange = (value: string) => {
    if (isSceneId(value)) {
      setSelectedScene(value);
    }
  };

  const closeCreatorModal = useCallback(() => {
    setIsCreatorOpen(false);
  }, []);

  const handleResetCustomCharacters = () => {
    setCustomCharacters([]);
    setCharacterPositions({ ...BASE_CHARACTER_DEFAULTS });
    setLockedCharacterIds((prev) => prev.filter((id) => id === "penguin" || id === "bear"));
    setSelectedCharacterId((prev) => (prev === "penguin" || prev === "bear" ? prev : null));
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
                components: characterDraft.components
              }
            : character
        )
      );
      setSelectedCharacterId(editingCharacterId);
      setEditingCharacterId(null);
    } else {
      const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `custom-${Date.now()}`;
      const position = getCenteredCharacterPosition(playgroundCharacterSize);
      const newCharacter: CustomCharacter = {
        id,
        type: "custom",
        name: trimmedName || `Custom ${customCharacters.length + 1}`,
        position,
        components: characterDraft.components
      };

      setCustomCharacters((prev) => [...prev, newCharacter]);
      setCharacterPositions((prev) => ({
        ...prev,
        [newCharacter.id]: position
      }));
      setSelectedCharacterId(newCharacter.id);
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
    setLockedCharacterIds((prev) => prev.filter((x) => x !== id));
    setSelectedCharacterId((prev) => (prev === id ? null : prev));
    setEditingCharacterId((prev) => (prev === id ? null : prev));
  };

  const handleExportSettings = () => {
    const snap = buildPlaygroundExport({
      isNightMode,
      selectedScene,
      customCharacters,
      characterPositions,
      showCharacterNames,
      builtInCharacterNames,
      lockedCharacterIds
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
      builtInCharacterNames,
      lockedCharacterIds
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
      setSelectedCharacterId(null);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const selectedActionInfo = useMemo(() => {
    if (!selectedCharacterId) {
      return null;
    }
    if (draggingCharacterId === selectedCharacterId) {
      return null;
    }
    if (selectedCharacterId === "penguin") {
      return {
        id: "penguin",
        name:
          builtInCharacterNames.penguin.trim() || DEFAULT_BUILT_IN_CHARACTER_NAMES.penguin,
        position: characterPositions.penguin ?? BASE_CHARACTER_DEFAULTS.penguin,
        kind: "builtIn" as const
      };
    }
    if (selectedCharacterId === "bear") {
      return {
        id: "bear",
        name: builtInCharacterNames.bear.trim() || DEFAULT_BUILT_IN_CHARACTER_NAMES.bear,
        position: characterPositions.bear ?? BASE_CHARACTER_DEFAULTS.bear,
        kind: "builtIn" as const
      };
    }
    const custom = customCharacters.find((c) => c.id === selectedCharacterId);
    if (!custom) {
      return null;
    }
    return {
      id: custom.id,
      name: custom.name,
      position: characterPositions[custom.id] ?? custom.position,
      kind: "custom" as const
    };
  }, [
    selectedCharacterId,
    draggingCharacterId,
    builtInCharacterNames,
    characterPositions,
    customCharacters
  ]);

  return (
    <>
      <SceneBackground sceneId={selectedScene} isNightMode={isNightMode} />
      <CharacterView
        className={`character-instance draggable-character${draggingCharacterId === "penguin" ? " dragging" : ""}`}
        boxSize={playgroundCharacterSize}
        components={PENGUIN_PRESET}
        position={characterPositions.penguin ?? BASE_CHARACTER_DEFAULTS.penguin}
        nameLabel={
          builtInCharacterNames.penguin.trim() || DEFAULT_BUILT_IN_CHARACTER_NAMES.penguin
        }
        showNameLabel={showCharacterNames}
        characterId="penguin"
        onArrowKeyNudge={nudgeCharacter}
        onPointerDown={startCharacterDrag("penguin", playgroundCharacterSize)}
        onPointerUp={() => handleSelectByPointerUp("penguin")}
      />
      <CharacterView
        className={`character-instance draggable-character${draggingCharacterId === "bear" ? " dragging" : ""}`}
        boxSize={playgroundCharacterSize}
        components={BEAR_PRESET}
        position={characterPositions.bear ?? BASE_CHARACTER_DEFAULTS.bear}
        nameLabel={builtInCharacterNames.bear.trim() || DEFAULT_BUILT_IN_CHARACTER_NAMES.bear}
        showNameLabel={showCharacterNames}
        characterId="bear"
        onArrowKeyNudge={nudgeCharacter}
        onPointerDown={startCharacterDrag("bear", playgroundCharacterSize)}
        onPointerUp={() => handleSelectByPointerUp("bear")}
      />

      {customCharacters.map((character) => (
        <CustomCharacterView
          key={character.id}
          character={character}
          boxSize={playgroundCharacterSize}
          position={characterPositions[character.id] ?? character.position}
          showNameLabel={showCharacterNames}
          onArrowKeyNudge={nudgeCharacter}
          onPointerDown={startCharacterDrag(character.id, playgroundCharacterSize)}
          onPointerUp={() => handleSelectByPointerUp(character.id)}
          isDragging={draggingCharacterId === character.id}
        />
      ))}

      {selectedActionInfo ? (
        <div
          className="character-action-controls"
          role="group"
          aria-label={`Actions for ${selectedActionInfo.name}`}
          style={{
            left: selectedActionInfo.position.x + playgroundCharacterSize.width / 2,
            top: selectedActionInfo.position.y - Math.max(28, Math.round(36 * (playgroundCharacterSize.height / DESKTOP_CHARACTER_PX)))
          }}
        >
          <button
            type="button"
            className={`rounded px-2 py-1 text-xs font-semibold text-white ${
              isCharacterLocked(selectedActionInfo.id) ? "bg-slate-500" : "bg-sky-600"
            }`}
            onClick={() => toggleCharacterLock(selectedActionInfo.id)}
            aria-pressed={isCharacterLocked(selectedActionInfo.id)}
          >
            {isCharacterLocked(selectedActionInfo.id) ? "Unlock" : "Lock"}
          </button>
          {selectedActionInfo.kind === "custom" ? (
            <>
              <button
                type="button"
                className="rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-white"
                onClick={() => handleEditCharacter(selectedActionInfo.id)}
              >
                Edit
              </button>
              <button
                type="button"
                className="rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white"
                onClick={() => handleDeleteCharacter(selectedActionInfo.id)}
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      ) : null}
      <ControlPanel
        modeLabel={modeLabel}
        isNightMode={isNightMode}
        showCharacterNames={showCharacterNames}
        builtInCharacterNames={builtInCharacterNames}
        selectedScene={selectedScene}
        scenePresets={SCENE_PRESETS}
        creatorError={creatorError}
        settingsMessage={settingsMessage}
        importSettingsInputRef={importSettingsInputRef}
        onModeChange={handleModeChange}
        onShowCharacterNamesChange={setShowCharacterNames}
        onPenguinNameChange={(value) =>
          setBuiltInCharacterNames((prev) => ({ ...prev, penguin: value }))
        }
        onBearNameChange={(value) =>
          setBuiltInCharacterNames((prev) => ({ ...prev, bear: value }))
        }
        onResetCustomCharacters={handleResetCustomCharacters}
        onOpenCreator={handleOpenCreator}
        onExportSettings={handleExportSettings}
        onImportSettingsClick={handleImportSettingsClick}
        onImportSettingsFile={handleImportSettingsFile}
        onCopyShareLink={() => void handleCopyShareLink()}
        onSceneChange={handleSceneChange}
      />

      <CharacterCreatorModal
        isOpen={isCreatorOpen}
        draft={characterDraft}
        title={editingCharacterId ? "Edit Character" : "Character Creator"}
        saveLabel={editingCharacterId ? "Save Changes" : "Save Character"}
        onClose={closeCreatorModal}
        onSave={handleSaveCharacter}
        onNameChange={(value) => setCharacterDraft((prev) => ({ ...prev, name: value }))}
        onComponentVariantChange={(key, variantId) => updateDraftComponent(key, { variantId })}
        onComponentColorChange={(key, color) => updateDraftComponent(key, { color })}
      />
    </>
  );
}

export default App;
