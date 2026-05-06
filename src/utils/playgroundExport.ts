import { MAX_CUSTOM_CHARACTERS } from "../constants/characterCreator";
import { isSceneId, type SceneId } from "../constants/scenes";
import {
  CHARACTER_COMPONENT_KEYS,
  type CharacterComponents,
  type CharacterPosition,
  type CustomCharacter
} from "../types/characters";
import type { BuiltInCharacterNames } from "./storage";
import { DEFAULT_BUILT_IN_CHARACTER_NAMES } from "./storage";

export const PLAYGROUND_EXPORT_VERSION = 1 as const;

export type PlaygroundExportV1 = {
  v: typeof PLAYGROUND_EXPORT_VERSION;
  isNightMode: boolean;
  selectedScene: SceneId;
  customCharacters: CustomCharacter[];
  characterPositions: Record<string, CharacterPosition>;
  showCharacterNames: boolean;
  builtInCharacterNames: BuiltInCharacterNames;
};

export function buildPlaygroundExport(state: Omit<PlaygroundExportV1, "v">): PlaygroundExportV1 {
  return { v: PLAYGROUND_EXPORT_VERSION, ...state };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeBuiltInNames(raw: unknown): BuiltInCharacterNames {
  const next = { ...DEFAULT_BUILT_IN_CHARACTER_NAMES };
  if (!isRecord(raw)) {
    return next;
  }
  if (typeof raw.penguin === "string") {
    next.penguin = raw.penguin;
  }
  if (typeof raw.bear === "string") {
    next.bear = raw.bear;
  }
  return next;
}

function isCharacterPosition(raw: unknown): raw is CharacterPosition {
  if (!isRecord(raw)) {
    return false;
  }
  return typeof raw.x === "number" && typeof raw.y === "number";
}

function isCharacterComponents(raw: unknown): raw is CharacterComponents {
  if (!isRecord(raw)) {
    return false;
  }
  return CHARACTER_COMPONENT_KEYS.every((key) => {
    const slot = raw[key];
    if (!isRecord(slot)) {
      return false;
    }
    return typeof slot.variantId === "string" && typeof slot.color === "string";
  });
}

function isCustomCharacter(raw: unknown): raw is CustomCharacter {
  if (!isRecord(raw)) {
    return false;
  }
  if (raw.type !== "custom" || typeof raw.id !== "string") {
    return false;
  }
  if (typeof raw.name !== "string") {
    return false;
  }
  if (!isCharacterPosition(raw.position)) {
    return false;
  }
  return isCharacterComponents(raw.components);
}

/** Returns parsed snapshot or null if the file is invalid. */
export function parsePlaygroundImport(raw: unknown): PlaygroundExportV1 | null {
  if (!isRecord(raw)) {
    return null;
  }
  if (raw.v !== PLAYGROUND_EXPORT_VERSION) {
    return null;
  }
  if (typeof raw.isNightMode !== "boolean") {
    return null;
  }
  if (typeof raw.selectedScene !== "string" || !isSceneId(raw.selectedScene)) {
    return null;
  }
  if (!Array.isArray(raw.customCharacters) || !raw.customCharacters.every(isCustomCharacter)) {
    return null;
  }
  if (raw.customCharacters.length > MAX_CUSTOM_CHARACTERS) {
    return null;
  }
  if (!isRecord(raw.characterPositions)) {
    return null;
  }
  const characterPositions: Record<string, CharacterPosition> = {};
  for (const [key, pos] of Object.entries(raw.characterPositions)) {
    if (!isCharacterPosition(pos)) {
      return null;
    }
    characterPositions[key] = pos;
  }
  if (typeof raw.showCharacterNames !== "boolean") {
    return null;
  }
  return {
    v: PLAYGROUND_EXPORT_VERSION,
    isNightMode: raw.isNightMode,
    selectedScene: raw.selectedScene,
    customCharacters: raw.customCharacters,
    characterPositions,
    showCharacterNames: raw.showCharacterNames,
    builtInCharacterNames: normalizeBuiltInNames(raw.builtInCharacterNames)
  };
}

const SHARE_HASH_PREFIX = "share=";

function utf8ToBase64(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/** Base64url-style payload for `#share=…` (omit if JSON is too large for typical URL limits). */
export function encodePlaygroundShareHash(state: PlaygroundExportV1): string | null {
  try {
    const json = JSON.stringify(state);
    if (json.length > 1600) {
      return null;
    }
    return utf8ToBase64(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return null;
  }
}

export function decodePlaygroundShareHash(payload: string): PlaygroundExportV1 | null {
  try {
    let b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4 !== 0) {
      b64 += "=";
    }
    const json = base64ToUtf8(b64);
    return parsePlaygroundImport(JSON.parse(json) as unknown);
  } catch {
    return null;
  }
}

export function readSharePayloadFromHash(hash: string): PlaygroundExportV1 | null {
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!trimmed.startsWith(SHARE_HASH_PREFIX)) {
    return null;
  }
  const encoded = trimmed.slice(SHARE_HASH_PREFIX.length);
  if (!encoded) {
    return null;
  }
  return decodePlaygroundShareHash(encoded);
}

export function buildShareUrl(state: PlaygroundExportV1): string | null {
  const encoded = encodePlaygroundShareHash(state);
  if (!encoded) {
    return null;
  }
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}#${SHARE_HASH_PREFIX}${encoded}`;
}
