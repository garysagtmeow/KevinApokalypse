export type PlantItem = {
  id: string;
  position: { x: number; y: number };
  knocked: boolean;
  wasKnocked: boolean;
};

export type SoilItem = {
  id: string;
  position: { x: number; y: number };
  collected: boolean;
};

export const LEVEL2_PLANT_COUNT = 3;
export const LEVEL2_SOIL_GOAL = 12;
export const LEVEL2_KEVIN_SPAWN_COUNT = 12;
export const LEVEL2_KEVIN_POOP_INTERVAL_MIN_MS = 1050;
export const LEVEL2_KEVIN_POOP_INTERVAL_MAX_MS = 1550;
export const PLANT_KNOCK_COOLDOWN_MS = 1500;
export const KEVIN_PLANT_HIT_RADIUS = 44;
export const PLANT_POT_HIT_RADIUS = 38;

export const LEVEL2_PLANT_SPAWNS = [
  { id: 'plant-a', x: 0.24, y: 0.42 },
  { id: 'plant-b', x: 0.46, y: 0.22 },
  { id: 'plant-c', x: 0.58, y: 0.30 },
] as const;

export const LEVEL2_INITIAL_POOP_SPAWNS = [
  { x: 0.3, y: 0.6 },
  { x: 0.52, y: 0.68 },
  { x: 0.58, y: 0.52 },
];

export function createPlantsFromBounds(
  bounds: { width: number; height: number },
  sessionKey: number,
  spawns: readonly { id: string; x: number; y: number }[] = LEVEL2_PLANT_SPAWNS,
): PlantItem[] {
  return spawns.map((spawn) => ({
    id: `${spawn.id}-${sessionKey}`,
    position: {
      x: spawn.x * bounds.width,
      y: spawn.y * bounds.height,
    },
    knocked: false,
    wasKnocked: false,
  }));
}

export function createSoilForKnockedPlant(plant: PlantItem): SoilItem[] {
  const pileCount = 4;
  const radiusX = 38;
  const radiusY = 26;

  return Array.from({ length: pileCount }, (_, index) => {
    const angle = (index / pileCount) * Math.PI * 2 + 0.4;
    return {
      id: `${plant.id}-soil-${index}`,
      position: {
        x: plant.position.x + Math.cos(angle) * radiusX,
        y: plant.position.y + Math.sin(angle) * radiusY + 18,
      },
      collected: false,
    };
  });
}
