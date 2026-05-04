import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { CharacterCreatorModal } from "./components/CharacterCreatorModal";
import { CustomCharacter as CustomCharacterView } from "./components/CustomCharacter";
import { CharacterView } from "./components/character/CharacterView";
import { SceneBackground } from "./components/backgrounds/SceneBackground";
import { BACKGROUND_OPTIONS, DEFAULT_BACKGROUND_CLASS } from "./constants/backgrounds";
import { BEAR_PRESET, PENGUIN_PRESET } from "./constants/builtInCharacters";
import { MAX_CUSTOM_CHARACTERS, createDefaultComponents } from "./constants/characterCreator";
import { BASE_CHARACTER_DEFAULTS, CHARACTER_SIZES } from "./constants/motion";
import { useCharacterMotion } from "./hooks/useCharacterMotion";
import type { CharacterComponentKey, CustomCharacter } from "./types/characters";
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
  const [selectedBackground, setSelectedBackground] = useState(
    () => storage.getSelectedBackground() || DEFAULT_BACKGROUND_CLASS
  );
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

  const modeLabel = useMemo(() => (isNightMode ? "Night Mode" : "Day Mode"), [isNightMode]);
  const customCharacterIds = useMemo(() => customCharacters.map((character) => character.id), [customCharacters]);
  const { characterPositions, setCharacterPositions, draggingCharacterId, startDrag, suppressSelectRef } =
    useCharacterMotion({
      customCharacterIds,
      initialPositions: storage.getCharacterPositions()
    });
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
    const nextBackgroundClass = selectedBackground || DEFAULT_BACKGROUND_CLASS;
    storage.setSelectedBackground(nextBackgroundClass);
    document.body.dataset.background = nextBackgroundClass;
    BACKGROUND_OPTIONS.forEach((option) => {
      document.body.classList.remove(option.className);
    });
    document.body.classList.add(nextBackgroundClass);
    return () => {
      document.body.classList.remove(nextBackgroundClass);
    };
  }, [selectedBackground]);

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

  const handleModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsNightMode(event.target.checked);
  };

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
      <SceneBackground isNightMode={isNightMode} />
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
        onPointerDown={startCharacterDrag("bear", CHARACTER_SIZES.base)}
      />

      {customCharacters.map((character) => (
        <div key={character.id}>
          <CustomCharacterView
            character={character}
            position={characterPositions[character.id] ?? character.position}
            showNameLabel={showCharacterNames}
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
      <div className="switch-container">
        <label className="switch">
          <input type="checkbox" id="mode-switch" checked={isNightMode} onChange={handleModeChange} />
          <span className="slider"></span>
        </label>
        <span id="mode-label">{modeLabel}</span>
        <label className="ml-2 flex cursor-pointer items-center gap-2 rounded bg-white/80 px-2 py-1 text-sm text-slate-700">
          <input
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
        <button className="ml-4 rounded bg-slate-800 px-3 py-2 text-sm text-white" onClick={handleResetCustomCharacters}>
          Reset Custom Characters
        </button>
        <button className="ml-2 rounded bg-sky-700 px-3 py-2 text-sm text-white" onClick={handleOpenCreator}>
          Create Character
        </button>
        <label className="ml-2 flex items-center gap-2 rounded bg-white/80 px-2 py-1 text-sm text-slate-700">
          Background
          <select
            className="rounded border border-slate-300 px-2 py-1 text-sm"
            value={selectedBackground}
            onChange={(event) => setSelectedBackground(event.target.value)}
          >
            {BACKGROUND_OPTIONS.map((option) => (
              <option key={option.className} value={option.className}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {creatorError ? <span className="ml-3 text-sm font-medium text-red-600">{creatorError}</span> : null}
      </div>

      <CharacterCreatorModal
        isOpen={isCreatorOpen}
        draft={characterDraft}
        title={editingCharacterId ? "Edit Character" : "Character Creator"}
        saveLabel={editingCharacterId ? "Save Changes" : "Save Character"}
        onClose={() => setIsCreatorOpen(false)}
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
