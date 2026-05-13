import type { ChangeEvent, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useId, useRef } from "react";
import {
  CHARACTER_COMPONENT_KEYS,
  CharacterComponentKey,
  CharacterComponents
} from "../types/characters";
import { CHARACTER_COMPONENT_LABELS, CHARACTER_VARIANT_OPTIONS } from "../constants/characterCreator";
import { CharacterCreatorPreview } from "./character/CharacterCreatorPreview";
import { useModalFocusTrap } from "../hooks/useModalFocusTrap";
import { usePhoneLayout } from "../hooks/usePhoneLayout";

type CharacterDraft = {
  name: string;
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
  onComponentVariantChange,
  onComponentColorChange
}: CharacterCreatorModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const isPhoneLayout = usePhoneLayout();
  useModalFocusTrap(panelRef, isOpen, onClose);

  const onOverlayPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isPhoneLayout) {
      return;
    }
    if (event.target !== event.currentTarget) {
      return;
    }
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.scrollTop = 0;
      body.scrollTop = 0;
      window.scrollTo(0, 0);
    };
  }, [isOpen]);

  const handleVariantChange =
    (key: CharacterComponentKey) => (event: ChangeEvent<HTMLSelectElement>) => {
      onComponentVariantChange(key, event.target.value);
    };

  const handleColorChange =
    (key: CharacterComponentKey) => (event: ChangeEvent<HTMLInputElement>) => {
      onComponentColorChange(key, event.target.value);
    };

  const componentSlots = CHARACTER_COMPONENT_KEYS.map((key) => {
    const headingId = `creator-slot-heading-${key}`;
    return (
      <div className="rounded border border-slate-200 p-3" key={key}>
        <p id={headingId} className="mb-2 text-sm font-semibold text-slate-800">
          {CHARACTER_COMPONENT_LABELS[key]}
        </p>
        <div className="flex items-center gap-2">
          <select
            className="min-h-[44px] w-full rounded border border-slate-300 px-2 py-1 text-sm"
            aria-labelledby={headingId}
            value={draft.components[key].variantId}
            onChange={handleVariantChange(key)}
          >
            {CHARACTER_VARIANT_OPTIONS[key].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            type="color"
            value={draft.components[key].color}
            onChange={handleColorChange(key)}
            aria-label={`${CHARACTER_COMPONENT_LABELS[key]} color`}
          />
        </div>
      </div>
    );
  });

  if (!isOpen) {
    return null;
  }

  if (isPhoneLayout) {
    return (
      <div
        ref={panelRef}
        className="fixed inset-0 z-[100] flex min-h-0 w-full flex-col overflow-hidden overscroll-none bg-white h-dvh max-h-dvh"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="shrink-0 border-b border-slate-200 px-4 py-3 pt-[max(12px,env(safe-area-inset-top,0px))]">
          <h2 id={titleId} className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
        </div>

        <div className="flex max-h-[38dvh] shrink-0 flex-col justify-center overflow-hidden border-b border-slate-100 bg-slate-50/90 px-2 py-2">
          <CharacterCreatorPreview
            components={draft.components}
            className="rounded-lg border-slate-200 p-2 shadow-none"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
          <div className="space-y-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Name
              <input
                className="min-h-[44px] rounded border border-slate-300 px-3 py-2 text-base"
                value={draft.name}
                onChange={(event) => onNameChange(event.target.value)}
                autoComplete="off"
              />
            </label>
            <div className="grid grid-cols-1 gap-3">{componentSlots}</div>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 border-t border-slate-200 bg-white px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
          <button
            className="min-h-[44px] min-w-[88px] rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
          <button
            className="min-h-[44px] flex-1 rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white"
            onClick={onSave}
            type="button"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden overscroll-none bg-black/45 p-4"
      onPointerDown={onOverlayPointerDown}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="max-h-[90vh] min-h-0 w-full max-w-5xl overflow-y-auto overscroll-contain rounded-xl bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id={titleId} className="text-xl font-semibold text-slate-900">
            {title}
          </h2>
          <button className="rounded bg-slate-200 px-3 py-1 text-sm" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="shrink-0 lg:sticky lg:top-0 lg:w-[300px]">
            <CharacterCreatorPreview components={draft.components} />
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Name
                <input
                  className="rounded border border-slate-300 px-3 py-2"
                  value={draft.name}
                  onChange={(event) => onNameChange(event.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{componentSlots}</div>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={onSave}
            type="button"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
