import { ChangeEvent, useEffect, useMemo, useState } from "react";
import type { CharacterPosition, CustomCharacter } from "./types/characters";
import { storage } from "./utils/storage";

function App() {
  const [isNightMode, setIsNightMode] = useState(() => storage.getNightMode());
  const [selectedBackground, setSelectedBackground] = useState(() => storage.getSelectedBackground());
  const [customCharacters, setCustomCharacters] = useState<CustomCharacter[]>(() =>
    storage.getCustomCharacters()
  );
  const [characterPositions, setCharacterPositions] = useState<Record<string, CharacterPosition>>(() =>
    storage.getCharacterPositions()
  );

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
      </div>
    </>
  );
}

export default App;
