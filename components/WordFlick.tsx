"use client";

import { useEffect, useRef, useState } from "react";
import {
  getDefaultWordFlickMachine,
  readWordFlickCache,
  writeWordFlickCache,
  type WordFlickMachineState,
} from "@/lib/word-flick-cache";
import { cn } from "@/lib/utils";

const NAME = "James\nSerritslev";

const WORDS = [
  "Hi.",
  "I'm James — I build websites.",
  "I focus on design that feels intentional and polished.",
  "I ship fast, content-managed websites built for search and performance.",
] as const;

const TYPE_SPEED = 30;
const NAME_TYPE_SPEED = 60;
const DELETE_SPEED = 20;
/** Pause ticks before backspace — one entry per phrase in WORDS. */
const SKIP_DELAYS = [45, 45, 90, 90] as const;

/** Ticks to wait after the name finishes before typing "Hi." */
const FIRST_PHRASE_DELAY = 55;

export function WordFlick() {
  const initialCache = readWordFlickCache();
  const skipEntrance = initialCache != null;

  const [nameText, setNameText] = useState(() => initialCache?.nameText ?? "");
  const [text, setText] = useState(() => initialCache?.text ?? "");
  const [cursorOn, setCursorOn] = useState<"name" | "phrase" | null>(
    () => initialCache?.cursorOn ?? "name"
  );

  const stateRef = useRef<WordFlickMachineState>(
    initialCache?.machine ?? getDefaultWordFlickMachine()
  );

  const displayRef = useRef({
    nameText: initialCache?.nameText ?? "",
    text: initialCache?.text ?? "",
    cursorOn: initialCache?.cursorOn ?? ("name" as "name" | "phrase" | null),
  });

  useEffect(() => {
    if (readWordFlickCache()?.complete) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const syncCache = (complete: boolean) => {
      writeWordFlickCache({
        machine: { ...stateRef.current },
        nameText: displayRef.current.nameText,
        text: displayRef.current.text,
        cursorOn: displayRef.current.cursorOn,
        complete,
      });
    };

    const setName = (value: string) => {
      displayRef.current.nameText = value;
      setNameText(value);
    };

    const setPhrase = (value: string) => {
      displayRef.current.text = value;
      setText(value);
    };

    const setCursor = (value: "name" | "phrase" | null) => {
      displayRef.current.cursorOn = value;
      setCursorOn(value);
    };

    const tick = () => {
      const state = stateRef.current;
      let delay = TYPE_SPEED;

      if (state.phase === "name") {
        delay = NAME_TYPE_SPEED;
        if (state.nameCharIndex < NAME.length) {
          state.nameCharIndex += 1;
          setName(NAME.substring(0, state.nameCharIndex));
        } else {
          state.phase = "phraseDelay";
          state.pauseTicks = 0;
          setCursor("phrase");
        }
        syncCache(false);
        timeoutId = setTimeout(tick, delay);
        return;
      }

      if (state.phase === "phraseDelay") {
        state.pauseTicks += 1;
        if (state.pauseTicks >= FIRST_PHRASE_DELAY) {
          state.phase = "phrases";
          state.pauseTicks = 0;
        }
        syncCache(false);
        timeoutId = setTimeout(tick, TYPE_SPEED);
        return;
      }

      const currentWord = WORDS[state.wordIndex];

      if (state.isDeleting) {
        state.charIndex -= 1;
        delay = DELETE_SPEED;
        if (state.charIndex <= 0) {
          state.isDeleting = false;
          state.wordIndex += 1;
          state.charIndex = 0;
          state.pauseTicks = 0;
        }
      } else if (state.charIndex < currentWord.length) {
        state.charIndex += 1;
      } else {
        state.pauseTicks += 1;
        if (state.pauseTicks >= SKIP_DELAYS[state.wordIndex]) {
          if (state.wordIndex === WORDS.length - 1) {
            setPhrase(currentWord);
            setCursor(null);
            syncCache(true);
            return;
          }
          state.isDeleting = true;
          state.pauseTicks = 0;
        }
      }

      setPhrase(currentWord.substring(0, state.charIndex));
      syncCache(false);
      timeoutId = setTimeout(tick, delay);
    };

    timeoutId = setTimeout(tick, NAME_TYPE_SPEED);

    return () => {
      clearTimeout(timeoutId);
      syncCache(displayRef.current.cursorOn === null);
    };
  }, []);

  return (
    <div className={cn(!skipEntrance && "animate-fade-in")}>
      <h1 className="relative mb-4 font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        <span className="invisible block whitespace-pre-line select-none" aria-hidden="true">
          {NAME}
        </span>
        <span className="absolute inset-0 whitespace-pre-line">
          {nameText}
          {cursorOn === "name" && <span className="animate-pulse">|</span>}
        </span>
      </h1>
      <p
        aria-live="polite"
        className="min-h-[2.5rem] max-w-xl font-sans text-sm leading-relaxed text-text-muted sm:min-h-[3rem] sm:text-base md:max-w-2xl"
      >
        {text}
        {cursorOn === "phrase" && <span className="animate-pulse">|</span>}
      </p>
    </div>
  );
}
