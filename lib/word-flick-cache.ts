export type WordFlickMachineState = {
  nameCharIndex: number;
};

export type WordFlickCache = {
  machine: WordFlickMachineState;
  nameText: string;
  cursorOn: boolean;
  complete: boolean;
};

const DEFAULT_MACHINE: WordFlickMachineState = {
  nameCharIndex: 0,
};

/** In-memory only — resets on hard refresh, persists across client-side navigations. */
let wordFlickCache: WordFlickCache | null = null;

export function readWordFlickCache(): WordFlickCache | null {
  return wordFlickCache;
}

export function writeWordFlickCache(cache: WordFlickCache): void {
  wordFlickCache = cache;
}

export function getDefaultWordFlickMachine(): WordFlickMachineState {
  return { ...DEFAULT_MACHINE };
}