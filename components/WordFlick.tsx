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

const NAME_TYPE_SPEED = 60;

export function WordFlick() {
  const initialCache = readWordFlickCache();
  const skipEntrance = initialCache != null;

  const [nameText, setNameText] = useState(() => initialCache?.nameText ?? "");
  const [cursorOn, setCursorOn] = useState(() => initialCache?.cursorOn ?? true);

  const stateRef = useRef<WordFlickMachineState>(
    initialCache?.machine ?? getDefaultWordFlickMachine()
  );

  const displayRef = useRef({
    nameText: initialCache?.nameText ?? "",
    cursorOn: initialCache?.cursorOn ?? true,
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
        cursorOn: displayRef.current.cursorOn,
        complete,
      });
    };

    const setName = (value: string) => {
      displayRef.current.nameText = value;
      setNameText(value);
    };

    const setCursor = (value: boolean) => {
      displayRef.current.cursorOn = value;
      setCursorOn(value);
    };

    const tick = () => {
      const state = stateRef.current;

      if (state.nameCharIndex < NAME.length) {
        state.nameCharIndex += 1;
        setName(NAME.substring(0, state.nameCharIndex));
        syncCache(false);
        timeoutId = setTimeout(tick, NAME_TYPE_SPEED);
        return;
      }

      setCursor(false);
      syncCache(true);
    };

    timeoutId = setTimeout(tick, NAME_TYPE_SPEED);

    return () => {
      clearTimeout(timeoutId);
      syncCache(!displayRef.current.cursorOn);
    };
  }, []);

  return (
    <div className={cn(!skipEntrance && "animate-fade-in")}>
      <h1 className="relative font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
        <span className="invisible block whitespace-pre-line select-none" aria-hidden="true">
          {NAME}
        </span>
        <span className="absolute inset-0 whitespace-pre-line">
          {nameText}
          {cursorOn && <span className="animate-pulse">|</span>}
        </span>
      </h1>
    </div>
  );
}