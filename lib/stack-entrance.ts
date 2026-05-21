export type StackEntranceOptions = {
  duration?: number;
  stagger?: number;
  delay?: number;
  offsetY?: number;
  onComplete?: () => void;
};

function easeOutQuart(t: number) {
  return 1 - (1 - t) ** 4;
}

function clearInlineMotionStyles(card: HTMLElement) {
  card.style.transition = "";
  card.style.opacity = "";
  card.style.transform = "";
  card.style.willChange = "";
}

export function runStackEntrance(
  cards: HTMLElement[],
  options: StackEntranceOptions = {},
): () => void {
  const duration = options.duration ?? 720;
  const stagger = options.stagger ?? 130;
  const delay = options.delay ?? 0;
  const offsetY = options.offsetY ?? 52;
  const onComplete = options.onComplete;

  cards.forEach((card) => {
    card.style.transition = "none";
    card.style.willChange = "transform, opacity";
    card.style.opacity = "0";
    card.style.transform = `translate3d(0, ${offsetY}px, 0)`;
  });

  let startTs: number | null = null;
  let animationId = 0;
  let delayTimeoutId = 0;
  const startOffsets = cards.map((_, index) => index * stagger);
  let cancelled = false;

  const finish = (invokeComplete = true) => {
    cards.forEach((card) => clearInlineMotionStyles(card));
    if (invokeComplete) onComplete?.();
  };

  const frame = (ts: number) => {
    if (cancelled) return;

    if (!startTs) startTs = ts;
    const elapsed = ts - startTs;
    let allDone = true;

    cards.forEach((card, index) => {
      const raw = Math.max(
        0,
        Math.min(1, (elapsed - startOffsets[index]!) / duration),
      );
      if (raw < 1) allDone = false;

      const t = easeOutQuart(raw);
      const fade = raw === 0 ? 0 : Math.min(1, Math.max(0, (raw - 0.04) / 0.32));

      card.style.opacity = fade.toFixed(3);
      card.style.transform = `translate3d(0, ${(offsetY * (1 - t)).toFixed(2)}px, 0)`;
    });

    if (allDone) {
      finish();
    } else {
      animationId = requestAnimationFrame(frame);
    }
  };

  const startAnimation = () => {
    if (cancelled) return;
    animationId = requestAnimationFrame(frame);
  };

  if (delay > 0) {
    delayTimeoutId = window.setTimeout(startAnimation, delay);
  } else {
    startAnimation();
  }

  return () => {
    cancelled = true;
    window.clearTimeout(delayTimeoutId);
    cancelAnimationFrame(animationId);
    finish(false);
  };
}
