import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

import {
  applyMovement,
  clampToBounds,
  type Bounds,
  type BoundsInsets,
  type EntitySize,
  type Vector2,
} from '@/src/systems/movement';
import {
  IS_WEB,
  WEB_IDLE_POLL_MS,
  shouldSyncPosition,
} from '@/src/utils/platform-performance';

const DEFAULT_SPEED = 180;
const MAX_DELTA_SECONDS = 0.05;

type UsePlayerMovementOptions = {
  speed?: number;
  entitySize?: EntitySize;
  boundsInsets?: BoundsInsets;
  resetKey?: number;
};

export function usePlayerMovement(
  bounds: Bounds | null,
  directionRef: RefObject<Vector2>,
  options: UsePlayerMovementOptions = {},
) {
  const speed = options.speed ?? DEFAULT_SPEED;
  const entitySize = options.entitySize ?? { width: 80, height: 130 };
  const boundsInsets = options.boundsInsets ?? {};
  const resetKey = options.resetKey ?? 0;
  const [position, setPosition] = useState<Vector2>({ x: 0, y: 0 });
  const positionRef = useRef<Vector2>({ x: 0, y: 0 });

  useEffect(() => {
    if (!bounds) {
      return;
    }

    const start = { x: bounds.width / 2, y: bounds.height / 2 };
    positionRef.current = start;
    setPosition(start);
  }, [bounds, resetKey]);

  useEffect(() => {
    if (!bounds) {
      return;
    }

    let frameId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastTime = performance.now();
    let lastSyncTime = 0;

    const syncPosition = (next: Vector2, now: number, force = false) => {
      positionRef.current = next;
      if (force || shouldSyncPosition(lastSyncTime, now)) {
        lastSyncTime = now;
        setPosition(next);
      }
    };

    const scheduleIdlePoll = () => {
      if (!IS_WEB) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      timeoutId = setTimeout(() => {
        timeoutId = null;
        frameId = requestAnimationFrame(tick);
      }, WEB_IDLE_POLL_MS);
    };

    const tick = (now: number) => {
      const direction = directionRef.current;
      if (direction.x === 0 && direction.y === 0) {
        scheduleIdlePoll();
        return;
      }

      const deltaSeconds = Math.min((now - lastTime) / 1000, MAX_DELTA_SECONDS);
      lastTime = now;

      const next = clampToBounds(
        applyMovement(positionRef.current, direction, speed, deltaSeconds),
        bounds,
        entitySize,
        boundsInsets,
      );
      syncPosition(next, now);

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    bounds,
    directionRef,
    speed,
    entitySize.width,
    entitySize.height,
    boundsInsets.top,
    boundsInsets.right,
    boundsInsets.bottom,
    boundsInsets.left,
  ]);

  return position;
}
