import { useCallback, useEffect, useRef, useState } from 'react';

import { TIMMY_RESCUE_HOLD_MS } from '@/src/systems/timmy-rescue';

type UseTimmyRescueHoldOptions = {
  enabled: boolean;
  onComplete: () => void;
};

export function useTimmyRescueHold({ enabled, onComplete }: UseTimmyRescueHoldOptions) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdStartedAtRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const cancelHold = useCallback(() => {
    holdStartedAtRef.current = null;
    setIsHolding(false);
    setProgress(0);

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const tickHold = useCallback(() => {
    const startedAt = holdStartedAtRef.current;
    if (startedAt === null) {
      return;
    }

    const elapsed = performance.now() - startedAt;
    const nextProgress = Math.min(elapsed / TIMMY_RESCUE_HOLD_MS, 1);
    setProgress(nextProgress);

    if (nextProgress >= 1) {
      cancelHold();
      onCompleteRef.current();
      return;
    }

    frameRef.current = requestAnimationFrame(tickHold);
  }, [cancelHold]);

  const startHold = useCallback(() => {
    if (!enabled) {
      return;
    }

    holdStartedAtRef.current = performance.now();
    setIsHolding(true);
    setProgress(0);
    frameRef.current = requestAnimationFrame(tickHold);
  }, [enabled, tickHold]);

  useEffect(() => {
    if (!enabled) {
      cancelHold();
    }
  }, [cancelHold, enabled]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  return {
    progress,
    isHolding,
    startHold,
    cancelHold,
  };
}
