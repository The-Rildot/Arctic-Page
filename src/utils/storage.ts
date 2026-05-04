import type { CharacterPosition, CustomCharacter } from "../types/characters";

export type BuiltInCharacterNames = {
  penguin: string;
  bear: string;
};

export const DEFAULT_BUILT_IN_CHARACTER_NAMES: BuiltInCharacterNames = {
  penguin: "Penguin",
  bear: "Polar Bear"
};

const STORAGE_KEYS = {
  isNightMode: "arctic:isNightMode",
  selectedBackground: "arctic:selectedBackground",
  customCharacters: "arctic:customCharacters",
  characterPositions: "arctic:characterPositions",
  showCharacterNames: "arctic:showCharacterNames",
  builtInCharacterNames: "arctic:builtInCharacterNames"
} as const;

function normalizeBuiltInCharacterNames(raw: unknown): BuiltInCharacterNames {
  const next = { ...DEFAULT_BUILT_IN_CHARACTER_NAMES };
  if (!raw || typeof raw !== "object") {
    return next;
  }
  const o = raw as Record<string, unknown>;
  if (typeof o.penguin === "string") {
    next.penguin = o.penguin;
  }
  if (typeof o.bear === "string") {
    next.bear = o.bear;
  }
  return next;
}

const safeParse = <T>(rawValue: string | null, fallback: T): T => {
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
};

export const storage = {
  getNightMode(): boolean {
    const value = localStorage.getItem(STORAGE_KEYS.isNightMode);
    return value === "true";
  },
  setNightMode(value: boolean): void {
    localStorage.setItem(STORAGE_KEYS.isNightMode, String(value));
  },
  getSelectedBackground(): string {
    return localStorage.getItem(STORAGE_KEYS.selectedBackground) ?? "";
  },
  setSelectedBackground(value: string): void {
    localStorage.setItem(STORAGE_KEYS.selectedBackground, value);
  },
  getCustomCharacters(): CustomCharacter[] {
    return safeParse<CustomCharacter[]>(localStorage.getItem(STORAGE_KEYS.customCharacters), []);
  },
  setCustomCharacters(value: CustomCharacter[]): void {
    localStorage.setItem(STORAGE_KEYS.customCharacters, JSON.stringify(value));
  },
  getCharacterPositions(): Record<string, CharacterPosition> {
    return safeParse<Record<string, CharacterPosition>>(
      localStorage.getItem(STORAGE_KEYS.characterPositions),
      {}
    );
  },
  setCharacterPositions(value: Record<string, CharacterPosition>): void {
    localStorage.setItem(STORAGE_KEYS.characterPositions, JSON.stringify(value));
  },
  resetCustomCharacters(): void {
    localStorage.removeItem(STORAGE_KEYS.customCharacters);
    localStorage.removeItem(STORAGE_KEYS.characterPositions);
  },
  getShowCharacterNames(): boolean {
    return localStorage.getItem(STORAGE_KEYS.showCharacterNames) === "true";
  },
  setShowCharacterNames(value: boolean): void {
    localStorage.setItem(STORAGE_KEYS.showCharacterNames, String(value));
  },
  getBuiltInCharacterNames(): BuiltInCharacterNames {
    return normalizeBuiltInCharacterNames(safeParse(localStorage.getItem(STORAGE_KEYS.builtInCharacterNames), null));
  },
  setBuiltInCharacterNames(value: BuiltInCharacterNames): void {
    localStorage.setItem(STORAGE_KEYS.builtInCharacterNames, JSON.stringify(value));
  }
};
