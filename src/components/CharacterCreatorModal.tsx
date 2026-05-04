import { ChangeEvent } from "react";
import {
  CHARACTER_COMPONENT_KEYS,
  CharacterComponentKey,
  CharacterComponents
} from "../types/characters";
import { CHARACTER_COMPONENT_LABELS, CHARACTER_VARIANT_OPTIONS } from "../constants/characterCreator";
import { CharacterCreatorPreview } from "./character/CharacterCreatorPreview";

type CharacterDraft = {
  name: string;
  messageText: string;
  components: CharacterComponents;
};

type CharacterCreatorModalProps = {
  isOpen: boolean;
  draft: CharacterDraft;
  title?: string;
  saveLabel?: string;
  onClose: () => void;
  onSave: () => void;
  onNameChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onComponentVariantChange: (key: CharacterComponentKey, variantId: string) => void;
  onComponentColorChange: (key: CharacterComponentKey, color: string) => void;
};

export function CharacterCreatorModal({
  isOpen,
  draft,
  title = "Character Creator",
  saveLabel = "Save Character",
  onClose,
  onSave,
  onNameChange,
  onMessageChange,
  onComponentVariantChange,
  onComponentColorChange
}: CharacterCreatorModalProps) {
  if (!isOpen) {
    return null;
  }

  const handleVariantChange =
    (key: CharacterComponentKey) => (event: ChangeEvent<HTMLSelectElement>) => {
      onComponentVariantChange(key, event.target.value);
    };

  const handleColorChange =
    (key: CharacterComponentKey) => (event: ChangeEvent<HTMLInputElement>) => {
      onComponentColorChange(key, event.target.value);
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button className="rounded bg-slate-200 px-3 py-1 text-sm" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="shrink-0 lg:sticky lg:top-0 lg:w-[300px]">
            <CharacterCreatorPreview components={draft.components} messageText={draft.messageText} />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Name
                <input
                  className="rounded border border-slate-300 px-3 py-2"
                  value={draft.name}
                  onChange={(event) => onNameChange(event.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Shirt Message
                <input
                  className="rounded border border-slate-300 px-3 py-2"
                  value={draft.messageText}
                  onChange={(event) => onMessageChange(event.target.value)}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {CHARACTER_COMPONENT_KEYS.map((key) => (
                <div className="rounded border border-slate-200 p-3" key={key}>
                  <p className="mb-2 text-sm font-semibold text-slate-800">{CHARACTER_COMPONENT_LABELS[key]}</p>
                  <div className="flex items-center gap-2">
                    <select
                      className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                      value={draft.components[key].variantId}
                      onChange={handleVariantChange(key)}
                    >
                      {CHARACTER_VARIANT_OPTIONS[key].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <input type="color" value={draft.components[key].color} onChange={handleColorChange(key)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white" onClick={onSave} type="button">
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
