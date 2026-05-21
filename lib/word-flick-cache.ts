export type WordFlickPhase = "name" | "phraseDelay" | "phrases";

export type WordFlickMachineState = {
  phase: WordFlickPhase;
  nameCharIndex: number;
  wordIndex: number;
  charIndex: number;
  isDeleting: boolean;
  pauseTicks: number;
};

export type WordFlickCache = {
  machine: WordFlickMachineState;
  nameText: string;
  text: string;
  cursorOn: "name" | "phrase" | null;
  complete: boolean;
};

const DEFAULT_MACHINE: WordFlickMachineState = {
  phase: "name",
  nameCharIndex: 0,
  wordIndex: 0,
  charIndex: 0,
  isDeleting: false,
  pauseTicks: 0,
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
