import { useCallback, useEffect, useState } from 'react';

import {
  clampMief,
  computeMiefRise,
  MIEF_COLLECT_RELIEF,
} from '@/src/systems/mief-meter';

const MAX_DELTA_SECONDS = 0.05;

export function useMiefMeter(
  uncleanedPoopCount: number,
  resetKey = 0,
  active = true,
) {
  const [mief, setMief] = useState(0);

  useEffect(() => {
    setMief(0);
  }, [resetKey]);

  useEffect(() => {
    if (!active) {
      return;
    }

    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const deltaSeconds = Math.min((now - lastTime) / 1000, MAX_DELTA_SECONDS);
      lastTime = now;

      if (uncleanedPoopCount > 0) {
        setMief((current) => {
          if (current >= 100) {
            return current;
          }

          return clampMief(current + computeMiefRise(uncleanedPoopCount, deltaSeconds));
        });
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [uncleanedPoopCount, active]);

  const relieveOnCollect = useCallback(() => {
    setMief((current) => clampMief(current - MIEF_COLLECT_RELIEF));
  }, []);

  const spikeMief = useCallback((amount: number) => {
    setMief((current) => clampMief(current + amount));
  }, []);

  return {
    mief: Math.round(mief),
    isCritical: mief >= 80,
    isGameOver: mief >= 100,
    relieveOnCollect,
    spikeMief,
  };
}
