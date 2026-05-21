type Point = { x: number; y: number };

type Curve = {
  P0: Point;
  P1: Point;
  P2: Point;
  P3: Point;
};

type CardTarget = {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

export type ArcEntranceOptions = {
  duration?: number;
  stagger?: number;
  delay?: number;
  onComplete?: () => void;
};

function getCardFinalPosition(card: HTMLElement, stage: HTMLElement): CardTarget {
  const rect = card.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  const x = rect.left - stageRect.left;
  const y = rect.top - stageRect.top;

  return {
    x,
    y,
    width: rect.width,
    height: rect.height,
    centerX: x + rect.width / 2,
    centerY: y + rect.height / 2,
  };
}

function cubicBezierPoint(P0: Point, P1: Point, P2: Point, P3: Point, t: number) {
  const mt = 1 - t;
  return {
    x: mt ** 3 * P0.x + 3 * mt ** 2 * t * P1.x + 3 * mt * t ** 2 * P2.x + t ** 3 * P3.x,
    y: mt ** 3 * P0.y + 3 * mt ** 2 * t * P1.y + 3 * mt * t ** 2 * P2.y + t ** 3 * P3.y,
  };
}

function easeOutQuart(t: number) {
  return 1 - (1 - t) ** 4;
}

function buildCurve(
  origin: Point,
  target: CardTarget,
  stageWidth: number,
  stageHeight: number,
): Curve {
  const P0 = { x: origin.x, y: origin.y };
  const P3 = { x: target.centerX, y: target.centerY };
  const minP1X = target.width * 0.65 + 32;

  const P1 = {
    x: Math.max(minP1X, origin.x * 0.44 + P3.x * 0.16),
    y: origin.y * 0.68,
  };
  const P2 = {
    x: P3.x * 0.76,
    y: Math.max(P3.y * 0.85, stageHeight * 0.12),
  };

  return { P0, P1, P2, P3 };
}

function clearInlineMotionStyles(card: HTMLElement) {
  card.style.transition = "";
  card.style.opacity = "";
  card.style.transform = "";
  card.style.willChange = "";
  card.style.zIndex = "";
}

function clearStageMotionStyles(stage: HTMLElement) {
  stage.style.isolation = "";
}

export function runArcEntrance(
  cards: HTMLElement[],
  stage: HTMLElement,
  options: ArcEntranceOptions = {},
): () => void {
  const duration = options.duration ?? 1100;
  const stagger = options.stagger ?? 180;
  const delay = options.delay ?? 0;
  const onComplete = options.onComplete;

  stage.style.isolation = "isolate";

  const stageRect = stage.getBoundingClientRect();
  const stageW = stageRect.width;
  const stageH = stageRect.height;

  const targets = cards.map((card) => getCardFinalPosition(card, stage));
  const maxCardHeight = Math.max(...targets.map((target) => target.height));

  const origin: Point = {
    x: stageW * 0.5,
    y: stageH + maxCardHeight + 120,
  };

  cards.forEach((card, index) => {
    const target = targets[index]!;
    card.style.transition = "none";
    card.style.willChange = "transform, opacity";
    card.style.zIndex = String(100 + index);
    card.style.opacity = "0";
    card.style.transform = `translate3d(${origin.x - target.centerX}px, ${origin.y - target.centerY}px, 0)`;
  });

  const curves = cards.map((_, index) => buildCurve(origin, targets[index]!, stageW, stageH));

  let startTs: number | null = null;
  let animationId = 0;
  let delayTimeoutId = 0;
  const startOffsets = cards.map((_, index) => index * stagger);
  let cancelled = false;

  const finish = (invokeComplete = true) => {
    cards.forEach((card) => clearInlineMotionStyles(card));
    clearStageMotionStyles(stage);
    if (invokeComplete) onComplete?.();
  };

  const frame = (ts: number) => {
    if (cancelled) return;

    if (!startTs) startTs = ts;
    const elapsed = ts - startTs;
    let allDone = true;

    cards.forEach((card, index) => {
      const target = targets[index]!;
      const raw = Math.max(
        0,
        Math.min(1, (elapsed - startOffsets[index]!) / duration),
      );
      if (raw < 1) allDone = false;

      const t = easeOutQuart(raw);
      const pos = cubicBezierPoint(
        curves[index]!.P0,
        curves[index]!.P1,
        curves[index]!.P2,
        curves[index]!.P3,
        t,
      );

      const offsetX = pos.x - target.centerX;
      const offsetY = pos.y - target.centerY;
      const fade = raw === 0 ? 0 : Math.min(1, Math.max(0, (raw - 0.06) / 0.28));

      card.style.opacity = fade.toFixed(3);
      card.style.transform = `translate3d(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px, 0)`;
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
