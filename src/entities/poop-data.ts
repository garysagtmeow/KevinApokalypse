export type PoopItem = {
  id: string;
  position: { x: number; y: number };
  collected: boolean;
};

export const LEVEL1_POOP_GOAL = 10;
export const LEVEL1_KEVIN_SPAWN_COUNT = 6;

export const LEVEL1_INITIAL_SPAWNS = [
  { x: 0.32, y: 0.58 },
  { x: 0.48, y: 0.72 },
  { x: 0.62, y: 0.48 },
  { x: 0.38, y: 0.38 },
];

export const LEVEL3_KEVIN_POOP_SPAWN_COUNT = 8;
export const LEVEL3_KEVIN_POOP_INTERVAL_MIN_MS = 2000;
export const LEVEL3_KEVIN_POOP_INTERVAL_MAX_MS = 2800;

export const LEVEL3_INITIAL_POOP_SPAWNS = [
  { x: 0.32, y: 0.62 },
  { x: 0.48, y: 0.7 },
  { x: 0.58, y: 0.55 },
];
