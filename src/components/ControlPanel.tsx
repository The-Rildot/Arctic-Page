import { useState, type ChangeEvent, type RefObject } from "react";
import type { SceneId } from "../constants/scenes";
import type { BuiltInCharacterNames } from "../utils/storage";

type ScenePreset = {
  id: SceneId;
  label: string;
};

type ControlPanelProps = {
  modeLabel: string;
  isNightMode: boolean;
  showCharacterNames: boolean;
  builtInCharacterNames: BuiltInCharacterNames;
  selectedScene: SceneId;
  scenePresets: readonly ScenePreset[];
  creatorError: string;
  settingsMessage: string;
  importSettingsInputRef: RefObject<HTMLInputElement | null>;
  onModeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onShowCharacterNamesChange: (checked: boolean) => void;
  onPenguinNameChange: (value: string) => void;
  onBearNameChange: (value: string) => void;
  onResetCustomCharacters: () => void;
  onOpenCreator: () => void;
  onExportSettings: () => void;
  onImportSettingsClick: () => void;
  onImportSettingsFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onCopyShareLink: () => void;
  onSceneChange: (value: string) => void;
};

export function ControlPanel({
  modeLabel,
  isNightMode,
  showCharacterNames,
  builtInCharacterNames,
  selectedScene,
  scenePresets,
  creatorError,
  settingsMessage,
  importSettingsInputRef,
  onModeChange,
  onShowCharacterNamesChange,
  onPenguinNameChange,
  onBearNameChange,
  onResetCustomCharacters,
  onOpenCreator,
  onExportSettings,
  onImportSettingsClick,
  onImportSettingsFile,
  onCopyShareLink,
  onSceneChange
}: ControlPanelProps) {
  const [isHidden, setIsHidden] = useState(false);

  if (isHidden) {
    return (
      <button
        type="button"
        className="control-panel-toggle rounded bg-slate-900/90 px-3 py-2 text-sm font-semibold text-white"
        onClick={() => setIsHidden(false)}
        aria-label="Show control panel"
      >
        Show Panel
      </button>
    );
  }

  return (
    <header className="switch-container" role="region" aria-label="Playground controls">
      <span className="sr-only">
        Tip: Tab to a character, then use arrow keys to nudge its position without dragging.
      </span>
      <button
        type="button"
        className="rounded bg-slate-700 px-3 py-2 text-sm text-white"
        onClick={() => setIsHidden(true)}
      >
        Hide Panel
      </button>
      <label className="switch" htmlFor="mode-switch">
        <span className="sr-only">Toggle day or night mode. Currently: {modeLabel}.</span>
        <input type="checkbox" id="mode-switch" checked={isNightMode} onChange={onModeChange} />
        <span className="slider" aria-hidden="true" />
      </label>
      <span id="mode-label" aria-hidden="true">
        {modeLabel}
      </span>
      <label
        htmlFor="toggle-show-names"
        className="flex cursor-pointer items-center gap-2 rounded bg-white/80 px-2 py-1 text-sm text-slate-700"
      >
        <input
          id="toggle-show-names"
          type="checkbox"
          checked={showCharacterNames}
          onChange={(event) => onShowCharacterNamesChange(event.target.checked)}
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
              onChange={(event) => onPenguinNameChange(event.target.value)}
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
              onChange={(event) => onBearNameChange(event.target.value)}
              maxLength={48}
              aria-label="Display name for Polar Bear"
            />
          </label>
        </>
      ) : null}
      <button type="button" className="rounded bg-slate-800 px-3 py-2 text-sm text-white" onClick={onResetCustomCharacters}>
        Reset Custom Characters
      </button>
      <button type="button" className="rounded bg-sky-700 px-3 py-2 text-sm text-white" onClick={onOpenCreator}>
        Create Character
      </button>
      <button
        type="button"
        className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
        onClick={onExportSettings}
      >
        Export
      </button>
      <button
        type="button"
        className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
        onClick={onImportSettingsClick}
      >
        Import
      </button>
      <input
        ref={importSettingsInputRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        aria-label="Import playground settings from JSON file"
        onChange={onImportSettingsFile}
      />
      <button
        type="button"
        className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
        onClick={onCopyShareLink}
      >
        Copy share link
      </button>
      <label htmlFor="scene-select" className="flex items-center gap-2 rounded bg-white/80 px-2 py-1 text-sm text-slate-700">
        Scene
        <select
          id="scene-select"
          className="rounded border border-slate-300 px-2 py-1 text-sm"
          value={selectedScene}
          onChange={(event) => onSceneChange(event.target.value)}
        >
          {scenePresets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
        </select>
      </label>
      {creatorError ? (
        <span className="text-sm font-medium text-red-600" role="alert">
          {creatorError}
        </span>
      ) : null}
      {settingsMessage ? (
        <span className="text-sm font-medium text-emerald-800" role="status" aria-live="polite">
          {settingsMessage}
        </span>
      ) : null}
    </header>
  );
}
