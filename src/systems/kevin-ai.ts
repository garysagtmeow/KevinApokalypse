export function randomUnitVector(): { x: number; y: number } {
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export const KEVIN_SPAWN_INTERVAL_MIN_MS = 1800;
export const KEVIN_SPAWN_INTERVAL_MAX_MS = 3200;
export const KEVIN_DIRECTION_CHANGE_MIN_MS = 1800;
export const KEVIN_DIRECTION_CHANGE_MAX_MS = 3200;

export function randomSpawnIntervalMs(
  minMs: number = KEVIN_SPAWN_INTERVAL_MIN_MS,
  maxMs: number = KEVIN_SPAWN_INTERVAL_MAX_MS,
): number {
  return randomBetween(minMs, maxMs);
}

export function randomDirectionChangeMs(): number {
  return randomBetween(KEVIN_DIRECTION_CHANGE_MIN_MS, KEVIN_DIRECTION_CHANGE_MAX_MS);
}

export function randomPoopOffset(): { x: number; y: number } {
  return {
    x: randomBetween(-18, 18),
    y: randomBetween(8, 22),
  };
}
