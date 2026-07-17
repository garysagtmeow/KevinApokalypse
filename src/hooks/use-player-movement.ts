import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import type { RefObject } from 'react';

import {
  applyMovement,
  clampToBounds,
  type Bounds,
  type BoundsInsets,
  type EntitySize,
  type Vector2,
} from '@/src/systems/movement';
import { IS_WEB, WEB_IDLE_POLL_MS } from '@/src/utils/platform-performance';

const DEFAULT_SPEED = 180;
const MAX_DELTA_SECONDS = 0.05;
const INTERACTION_SYNC_MS = IS_WEB ? 220 : 80;

export type PlayerMovementResult = {
  positionRef: RefObject<Vector2>;
  interactionPoint: Vector2;
  animatedStyle: {
    transform: [{ translateX: Animated.Value }, { translateY: Animated.Value }];
  };
};

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
): PlayerMovementResult {
  const speed = options.speed ?? DEFAULT_SPEED;
  const entitySize = options.entitySize ?? { width: 80, height: 130 };
  const boundsInsets = options.boundsInsets ?? {};
  const resetKey = options.resetKey ?? 0;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const positionRef = useRef<Vector2>({ x: 0, y: 0 });
  const [interactionPoint, setInteractionPoint] = useState<Vector2>({ x: 0, y: 0 });
  const halfW = entitySize.width / 2;
  const halfH = entitySize.height / 2;

  const applyVisualPosition = (next: Vector2) => {
    positionRef.current = next;
    translateX.setValue(next.x - halfW);
    translateY.setValue(next.y - halfH);
  };

  useEffect(() => {
    if (!bounds) {
      return;
    }

    const start = { x: bounds.width / 2, y: bounds.height / 2 };
    applyVisualPosition(start);
    setInteractionPoint(start);
  }, [bounds, halfH, halfW, resetKey]);

  useEffect(() => {
    if (!bounds) {
      return;
    }

    const interval = setInterval(() => {
      setInteractionPoint({ ...positionRef.current });
    }, INTERACTION_SYNC_MS);

    return () => clearInterval(interval);
  }, [bounds, resetKey]);

  useEffect(() => {
    if (!bounds) {
      return;
    }

    let frameId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastTime = performance.now();

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
      applyVisualPosition(next);

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
    entitySize,
    boundsInsets,
    halfH,
    halfW,
    speed,
  ]);

  return {
    positionRef,
    interactionPoint,
    animatedStyle: {
      transform: [{ translateX }, { translateY }],
    },
  };
}
