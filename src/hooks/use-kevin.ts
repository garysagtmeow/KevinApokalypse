import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

import { KEVIN_ENTITY_SIZE } from '@/src/entities/Kevin';
import {
  KEVIN_BOX_HIT_RADIUS,
  BOX_HIT_RADIUS,
  type BoxItem,
} from '@/src/entities/cardboard-data';
import {
  KEVIN_PLANT_HIT_RADIUS,
  PLANT_POT_HIT_RADIUS,
  type PlantItem,
} from '@/src/entities/plant-data';
import {
  applyMovement,
  clampToBounds,
  type Bounds,
  type Vector2,
} from '@/src/systems/movement';
import { getKevinKnastSpawn, type KevinKnastPlacement } from '@/src/systems/kevin-knast';
import {
  randomBetween,
  randomDirectionChangeMs,
  randomPoopOffset,
  randomSpawnIntervalMs,
  randomUnitVector,
} from '@/src/systems/kevin-ai';

const DEFAULT_KEVIN_SPEED = 110;
const MAX_DELTA_SECONDS = 0.05;

export type PlantKnockEvent = {
  plantId: string;
};

export type BoxKnockEvent = {
  boxId: string;
};

type DestructibleItem = {
  id: string;
  position: Vector2;
  knocked: boolean;
  wasKnocked: boolean;
  cleared?: boolean;
};

type UseKevinOptions = {
  resetKey: number;
  active: boolean;
  canSpawn: boolean;
  onDropPoop: (position: Vector2) => void;
  speed?: number;
  directionChangeFactor?: number;
  plantSeekChance?: number;
  plantsRef?: RefObject<PlantItem[]>;
  onPlantKnock?: (event: PlantKnockEvent) => void;
  boxSeekChance?: number;
  boxesRef?: RefObject<BoxItem[]>;
  onBoxKnock?: (event: BoxKnockEvent) => void;
  knastPlacement?: KevinKnastPlacement;
  plantKnockCooldownMs?: number;
  boxKnockCooldownMs?: number;
  poopSpawnIntervalMinMs?: number;
  poopSpawnIntervalMaxMs?: number;
};

function pickSeekTarget(
  position: Vector2,
  items: DestructibleItem[],
): DestructibleItem | null {
  const standing = items.filter(
    (item) => !item.knocked && !item.wasKnocked && !item.cleared,
  );
  if (standing.length === 0) {
    return null;
  }

  return standing[Math.floor(Math.random() * standing.length)];
}

function pickKevinDirection(
  position: Vector2,
  plantsRef: RefObject<PlantItem[]> | undefined,
  plantSeekChance: number,
  boxesRef: RefObject<BoxItem[]> | undefined,
  boxSeekChance: number,
): Vector2 {
  const plants = plantsRef?.current ?? [];
  const boxes = boxesRef?.current ?? [];

  if (plants.length > 0 && Math.random() < plantSeekChance) {
    const target = pickSeekTarget(position, plants);
    if (target) {
      return steerToward(position, target.position);
    }
  }

  if (boxes.length > 0 && Math.random() < boxSeekChance) {
    const target = pickSeekTarget(position, boxes);
    if (target) {
      return steerToward(position, target.position);
    }
  }

  return randomUnitVector();
}

function steerToward(position: Vector2, targetPosition: Vector2): Vector2 {
  const dx = targetPosition.x - position.x;
  const dy = targetPosition.y - position.y;
  const magnitude = Math.hypot(dx, dy);

  if (magnitude > 8) {
    const angle = Math.atan2(dy, dx) + randomBetween(-0.55, 0.55);
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  }

  return randomUnitVector();
}

function tryKnockDestructible(
  nextPosition: Vector2,
  items: DestructibleItem[],
  knockedIds: Set<string>,
  hitCenterOffsetY: number,
  entityHitRadius: number,
  targetHitRadius: number,
  onKnock: (id: string) => void,
): boolean {
  for (const item of items) {
    if (item.knocked || item.wasKnocked || item.cleared || knockedIds.has(item.id)) {
      continue;
    }

    const centerY = item.position.y + hitCenterOffsetY;
    const hitDistance = Math.hypot(nextPosition.x - item.position.x, nextPosition.y - centerY);

    if (hitDistance > entityHitRadius + targetHitRadius) {
      continue;
    }

    knockedIds.add(item.id);
    onKnock(item.id);
    return true;
  }

  return false;
}

export function useKevin(bounds: Bounds | null, options: UseKevinOptions) {
  const {
    resetKey,
    active,
    canSpawn,
    onDropPoop,
    speed = DEFAULT_KEVIN_SPEED,
    directionChangeFactor = 1,
    plantSeekChance = 0,
    plantsRef,
    onPlantKnock,
    boxSeekChance = 0,
    boxesRef,
    onBoxKnock,
    knastPlacement,
    plantKnockCooldownMs = 0,
    boxKnockCooldownMs = 0,
    poopSpawnIntervalMinMs,
    poopSpawnIntervalMaxMs,
  } = options;
  const [position, setPosition] = useState<Vector2>({ x: 0, y: 0 });
  const directionRef = useRef<Vector2>(randomUnitVector());
  const positionRef = useRef<Vector2>({ x: 0, y: 0 });
  const boundsRef = useRef<Bounds | null>(bounds);
  const canSpawnRef = useRef(canSpawn);
  const knockedPlantIdsRef = useRef<Set<string>>(new Set());
  const knockedBoxIdsRef = useRef<Set<string>>(new Set());
  const lastPlantKnockAtRef = useRef(-Infinity);
  const lastBoxKnockAtRef = useRef(-Infinity);
  const onDropPoopRef = useRef(onDropPoop);
  const onPlantKnockRef = useRef(onPlantKnock);
  const onBoxKnockRef = useRef(onBoxKnock);
  const spawnedForResetKeyRef = useRef<number | null>(null);
  boundsRef.current = bounds;
  canSpawnRef.current = canSpawn;
  onDropPoopRef.current = onDropPoop;
  onPlantKnockRef.current = onPlantKnock;
  onBoxKnockRef.current = onBoxKnock;

  const boundsWidth = bounds?.width ?? 0;
  const boundsHeight = bounds?.height ?? 0;
  const knastTopRatio = knastPlacement?.topRatio ?? 0;
  const knastTopOffset = knastPlacement?.topOffset ?? 0;

  useEffect(() => {
    knockedPlantIdsRef.current = new Set();
    knockedBoxIdsRef.current = new Set();
    lastPlantKnockAtRef.current = -Infinity;
    lastBoxKnockAtRef.current = -Infinity;
    spawnedForResetKeyRef.current = null;
  }, [resetKey]);

  useEffect(() => {
    if (boundsWidth <= 0 || boundsHeight <= 0) {
      return;
    }

    if (spawnedForResetKeyRef.current === resetKey) {
      return;
    }

    const currentBounds = boundsRef.current;
    if (!currentBounds) {
      return;
    }

    spawnedForResetKeyRef.current = resetKey;
    const start = getKevinKnastSpawn(currentBounds, knastPlacement);
    positionRef.current = start;
    setPosition(start);
    directionRef.current = randomUnitVector();
  }, [boundsHeight, boundsWidth, knastTopOffset, knastTopRatio, resetKey]);

  useEffect(() => {
    if (!boundsRef.current || !active) {
      return;
    }

    let frameId = 0;
    let lastTime = performance.now();
    let directionTimerMs = 0;
    let nextDirectionChangeMs = randomDirectionChangeMs() * directionChangeFactor;
    let spawnTimerMs = 0;
    let nextSpawnMs = randomSpawnIntervalMs(poopSpawnIntervalMinMs, poopSpawnIntervalMaxMs);

    const tick = (now: number) => {
      const currentBounds = boundsRef.current;
      if (!currentBounds) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const deltaSeconds = Math.min((now - lastTime) / 1000, MAX_DELTA_SECONDS);
      const deltaMs = deltaSeconds * 1000;
      lastTime = now;

      directionTimerMs += deltaMs;
      if (directionTimerMs >= nextDirectionChangeMs) {
        directionTimerMs = 0;
        nextDirectionChangeMs = randomDirectionChangeMs() * directionChangeFactor;
        directionRef.current = pickKevinDirection(
          positionRef.current,
          plantsRef,
          plantSeekChance,
          boxesRef,
          boxSeekChance,
        );
      }

      const nextPosition = clampToBounds(
        applyMovement(positionRef.current, directionRef.current, speed, deltaSeconds),
        currentBounds,
        KEVIN_ENTITY_SIZE,
        { top: 16, bottom: 12, left: 12, right: 12 },
      );
      positionRef.current = nextPosition;
      setPosition(nextPosition);

      if (plantsRef?.current && onPlantKnockRef.current) {
        const timeSinceLastKnock = now - lastPlantKnockAtRef.current;
        const canKnockPlant =
          lastPlantKnockAtRef.current === -Infinity ||
          timeSinceLastKnock >= plantKnockCooldownMs;

        if (canKnockPlant) {
          const knocked = tryKnockDestructible(
            nextPosition,
            plantsRef.current,
            knockedPlantIdsRef.current,
            -14,
            KEVIN_PLANT_HIT_RADIUS,
            PLANT_POT_HIT_RADIUS,
            (plantId) => {
              lastPlantKnockAtRef.current = now;
              onPlantKnockRef.current?.({ plantId });
            },
          );

          if (knocked) {
            // Plant knock handled.
          }
        }
      }

      if (boxesRef?.current && onBoxKnockRef.current) {
        const timeSinceLastKnock = now - lastBoxKnockAtRef.current;
        const canKnockBox =
          lastBoxKnockAtRef.current === -Infinity || timeSinceLastKnock >= boxKnockCooldownMs;

        if (canKnockBox) {
          tryKnockDestructible(
            nextPosition,
            boxesRef.current,
            knockedBoxIdsRef.current,
            -20,
            KEVIN_BOX_HIT_RADIUS,
            BOX_HIT_RADIUS,
            (boxId) => {
              lastBoxKnockAtRef.current = now;
              onBoxKnockRef.current?.({ boxId });
            },
          );
        }
      }

      if (canSpawnRef.current) {
        spawnTimerMs += deltaMs;
        if (spawnTimerMs >= nextSpawnMs) {
          spawnTimerMs = 0;
          nextSpawnMs = randomSpawnIntervalMs(poopSpawnIntervalMinMs, poopSpawnIntervalMaxMs);

          const offset = randomPoopOffset();
          onDropPoopRef.current({
            x: nextPosition.x + offset.x,
            y: nextPosition.y + offset.y,
          });
        }
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [
    active,
    boxKnockCooldownMs,
    boxSeekChance,
    boxesRef,
    directionChangeFactor,
    plantKnockCooldownMs,
    plantSeekChance,
    plantsRef,
    poopSpawnIntervalMaxMs,
    poopSpawnIntervalMinMs,
    speed,
  ]);

  return position;
}
