import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

import {
  applyMovement,
  clampToBounds,
  type Bounds,
  type BoundsInsets,
  type EntitySize,
  type Vector2,
} from '@/src/systems/movement';

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

  useEffect(() => {
    if (!bounds) {
      return;
    }

    setPosition({ x: bounds.width / 2, y: bounds.height / 2 });
  }, [bounds, resetKey]);

  useEffect(() => {
    if (!bounds) {
      return;
    }

    let frameId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const deltaSeconds = Math.min((now - lastTime) / 1000, MAX_DELTA_SECONDS);
      lastTime = now;

      const direction = directionRef.current;
      if (direction.x !== 0 || direction.y !== 0) {
        setPosition((prev) =>
          clampToBounds(
            applyMovement(prev, direction, speed, deltaSeconds),
            bounds,
            entitySize,
            boundsInsets,
          ),
        );
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
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
