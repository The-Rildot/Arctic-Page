import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { CharacterCreatorModal } from "./components/CharacterCreatorModal";
import { CustomCharacter as CustomCharacterView } from "./components/CustomCharacter";
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

  const modeLabel = useMemo(() => (isNightMode ? "Night Mode" : "Day Mode"), [isNightMode]);

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

  const handleModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsNightMode(event.target.checked);
  };

  const handleResetCustomCharacters = () => {
    setCustomCharacters([]);
    setCharacterPositions({});
    storage.resetCustomCharacters();
  };

  const handleOpenCreator = () => {
    if (customCharacters.length >= MAX_CUSTOM_CHARACTERS) {
      setCreatorError(`You can only create ${MAX_CUSTOM_CHARACTERS} custom characters.`);
      return;
    }
    setCreatorError("");
    setCharacterDraft(createDefaultDraft());
    setIsCreatorOpen(true);
  };

  const handleSaveCharacter = () => {
    if (customCharacters.length >= MAX_CUSTOM_CHARACTERS) {
      setCreatorError(`You can only create ${MAX_CUSTOM_CHARACTERS} custom characters.`);
      return;
    }

    const trimmedName = characterDraft.name.trim();
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
    setIsCreatorOpen(false);
    setCreatorError("");
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

  const withDarkMode = (className: string) => (isNightMode ? `${className} dark-mode` : className);

  return (
    <>
      <div className={withDarkMode("left-mountain")}></div>
      <div className={withDarkMode("back-mountain")}></div>
      <div className={withDarkMode("sun")}></div>
      <div className="igloo">
        <img src="https://www.pngall.com/wp-content/uploads/4/Igloo-PNG-Image-HD.png" />
      </div>
      <div className="penguin">
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
      <div className="bear">
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
        <CustomCharacterView
          key={character.id}
          character={character}
          position={characterPositions[character.id] ?? character.position}
        />
      ))}

      <div className={withDarkMode("ground")}></div>
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
