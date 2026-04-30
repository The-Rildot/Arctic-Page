import { ChangeEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { CharacterCreatorModal } from "./components/CharacterCreatorModal";
import { CustomCharacter as CustomCharacterView } from "./components/CustomCharacter";
import { SceneBackground } from "./components/backgrounds/SceneBackground";
import { MAX_CUSTOM_CHARACTERS, createDefaultComponents } from "./constants/characterCreator";
import type { CharacterComponentKey, CharacterPosition, CustomCharacter } from "./types/characters";
import { storage } from "./utils/storage";

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

const BASE_CHARACTER_DEFAULTS: Record<string, CharacterPosition> = {
  penguin: { x: 140, y: 120 },
  bear: { x: 520, y: 120 }
};

const CHARACTER_SIZES = {
  base: { width: 300, height: 300 },
  custom: { width: 140, height: 180 }
} as const;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function App() {
  const [isNightMode, setIsNightMode] = useState(() => storage.getNightMode());
  const [selectedBackground, setSelectedBackground] = useState(() => storage.getSelectedBackground());
  const [customCharacters, setCustomCharacters] = useState<CustomCharacter[]>(() =>
    storage.getCustomCharacters()
  );
  const [characterPositions, setCharacterPositions] = useState<Record<string, CharacterPosition>>(() =>
    storage.getCharacterPositions()
  );
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [characterDraft, setCharacterDraft] = useState<CharacterDraft>(() => createDefaultDraft());
  const [creatorError, setCreatorError] = useState("");
  const [draggingCharacterId, setDraggingCharacterId] = useState<string | null>(null);
  const [selectedCustomCharacterId, setSelectedCustomCharacterId] = useState<string | null>(null);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);

  const dragStateRef = useRef<{
    id: string;
    pointerOffsetX: number;
    pointerOffsetY: number;
    width: number;
    height: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const suppressSelectRef = useRef<string | null>(null);

  const modeLabel = useMemo(() => (isNightMode ? "Night Mode" : "Day Mode"), [isNightMode]);
  const customCharacterIds = useMemo(() => customCharacters.map((character) => character.id), [customCharacters]);
  const draggableCharacterIds = useMemo(
    () => ["penguin", "bear", ...customCharacterIds],
    [customCharacterIds]
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
    storage.setSelectedBackground(selectedBackground);
    document.body.dataset.background = selectedBackground;
  }, [selectedBackground]);

  useEffect(() => {
    storage.setCustomCharacters(customCharacters);
  }, [customCharacters]);

  useEffect(() => {
    storage.setCharacterPositions(characterPositions);
  }, [characterPositions]);

  useEffect(() => {
    setCharacterPositions((prev) => ({
      ...BASE_CHARACTER_DEFAULTS,
      ...prev
    }));
  }, []);

  useEffect(() => {
    const wanderInterval = window.setInterval(() => {
      setCharacterPositions((prev) => {
        const next = { ...prev };

        draggableCharacterIds.forEach((id) => {
          if (dragStateRef.current?.id === id) {
            return;
          }

          if (Math.random() > 0.35) {
            return;
          }

          const isCustomCharacter = customCharacterIds.includes(id);
          const size = isCustomCharacter ? CHARACTER_SIZES.custom : CHARACTER_SIZES.base;
          const current = next[id] ?? (isCustomCharacter ? { x: 200, y: 220 } : BASE_CHARACTER_DEFAULTS[id]);
          const deltaX = Math.floor(Math.random() * 121) - 60;
          const deltaY = Math.floor(Math.random() * 101) - 50;
          const maxX = Math.max(0, window.innerWidth - size.width);
          const maxY = Math.max(0, window.innerHeight - size.height);

          next[id] = {
            x: clamp(current.x + deltaX, 0, maxX),
            y: clamp(current.y + deltaY, 0, maxY)
          };
        });

        return next;
      });
    }, 1800);

    return () => {
      window.clearInterval(wanderInterval);
    };
  }, [customCharacterIds, draggableCharacterIds]);

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

  const startDrag =
    (id: string, size: { width: number; height: number }) => (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const currentPosition = characterPositions[id] ?? BASE_CHARACTER_DEFAULTS[id] ?? { x: 200, y: 220 };
      dragStateRef.current = {
        id,
        pointerOffsetX: event.clientX - currentPosition.x,
        pointerOffsetY: event.clientY - currentPosition.y,
        width: size.width,
        height: size.height,
        startX: event.clientX,
        startY: event.clientY,
        moved: false
      };
      setDraggingCharacterId(id);
      setSelectedCustomCharacterId((prev) => (id === prev ? prev : null));
    };

  useEffect(() => {
    const handlePointerMove = (event: globalThis.PointerEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState) {
        return;
      }

      if (
        !dragState.moved &&
        (Math.abs(event.clientX - dragState.startX) > 4 || Math.abs(event.clientY - dragState.startY) > 4)
      ) {
        dragState.moved = true;
      }

      const maxX = Math.max(0, window.innerWidth - dragState.width);
      const maxY = Math.max(0, window.innerHeight - dragState.height);
      const nextPosition = {
        x: clamp(event.clientX - dragState.pointerOffsetX, 0, maxX),
        y: clamp(event.clientY - dragState.pointerOffsetY, 0, maxY)
      };

      setCharacterPositions((prev) => ({
        ...prev,
        [dragState.id]: nextPosition
      }));
    };

    const stopDragging = () => {
      if (!dragStateRef.current) {
        return;
      }
      if (dragStateRef.current.moved) {
        suppressSelectRef.current = dragStateRef.current.id;
      }
      dragStateRef.current = null;
      setDraggingCharacterId(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
      window.removeEventListener("pointercancel", stopDragging);
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      if (target.closest(".custom-character") || target.closest(".character-action-controls")) {
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
      <div
        className={`penguin draggable-character${draggingCharacterId === "penguin" ? " dragging" : ""}`}
        style={{
          position: "absolute",
          left: (characterPositions.penguin ?? BASE_CHARACTER_DEFAULTS.penguin).x,
          top: (characterPositions.penguin ?? BASE_CHARACTER_DEFAULTS.penguin).y,
          margin: 0
        }}
        onPointerDown={startDrag("penguin", CHARACTER_SIZES.base)}
      >
        <div className="penguin-head">
          <div className="face left"></div>
          <div className="face right"></div>
          <div className="chin"></div>
          <div className="eye left">
            <div className="eye-lid"></div>
          </div>
          <div className="eye right">
            <div className="eye-lid"></div>
          </div>
          <div className="blush left"></div>
          <div className="blush right"></div>
          <div className="beak top"></div>
          <div className="beak bottom"></div>
        </div>
        <div className="shirt">
          <div>💜</div>
          <p>I CSS</p>
        </div>
        <div className="penguin-body">
          <div className="arm left"></div>
          <div className="arm right"></div>
          <div className="foot left"></div>
          <div className="foot right"></div>
        </div>
      </div>
      <div
        className={`bear draggable-character${draggingCharacterId === "bear" ? " dragging" : ""}`}
        style={{
          left: (characterPositions.bear ?? BASE_CHARACTER_DEFAULTS.bear).x,
          top: (characterPositions.bear ?? BASE_CHARACTER_DEFAULTS.bear).y
        }}
        onPointerDown={startDrag("bear", CHARACTER_SIZES.base)}
      >
        <div className="bear-head">
          <div className="bear_ear left">
            <div className="bear_ear_in left"></div>
          </div>
          <div className="bear_ear right">
            <div className="bear_ear_in right"></div>
          </div>
          <div className="bear_eye left">
            <div className="bear_eye-lid"></div>
          </div>
          <div className="bear_eye right">
            <div className="bear_eye-lid"></div>
          </div>
          <div className="bear_blush left"></div>
          <div className="bear_blush right"></div>
          <div className="nose top"></div>
          <div className="nose bottom"></div>
        </div>
        <div className="bear_shirt">
          <div>💖</div>
          <p>I HTML</p>
        </div>
        <div className="bear-body">
          <div className="bear_arm left"></div>
          <div className="bear_arm right"></div>
          <div className="bear_foot left"></div>
          <div className="bear_foot right"></div>
        </div>
      </div>

      {customCharacters.map((character) => (
        <div key={character.id}>
          <CustomCharacterView
            character={character}
            position={characterPositions[character.id] ?? character.position}
            onPointerDown={startDrag(character.id, CHARACTER_SIZES.custom)}
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
        <button className="ml-4 rounded bg-slate-800 px-3 py-2 text-sm text-white" onClick={handleResetCustomCharacters}>
          Reset Custom Characters
        </button>
        <button className="ml-2 rounded bg-sky-700 px-3 py-2 text-sm text-white" onClick={handleOpenCreator}>
          Create Character
        </button>
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
