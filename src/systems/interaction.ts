import type { PaperScrapItem } from '@/src/entities/cardboard-data';
import type { PlantItem, SoilItem } from '@/src/entities/plant-data';
import type { PoopItem } from '@/src/entities/poop-data';
import type { Vector2 } from '@/src/systems/movement';

export function distance(a: Vector2, b: Vector2): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export type GameTarget =
  | { kind: 'poop'; item: PoopItem; distance: number }
  | { kind: 'soil'; item: SoilItem; distance: number }
  | { kind: 'plant'; item: PlantItem; distance: number }
  | { kind: 'scrap'; item: PaperScrapItem; distance: number };

type FindNearestGameTargetOptions = {
  scraps?: PaperScrapItem[];
};

export function findNearestGameTarget(
  playerPosition: Vector2,
  poops: PoopItem[],
  soils: SoilItem[],
  plants: PlantItem[],
  radius: number,
  options: FindNearestGameTargetOptions = {},
): GameTarget | null {
  const { scraps = [] } = options;
  let nearest: GameTarget | null = null;
  let nearestDistance = radius;

  for (const scrap of scraps) {
    if (scrap.recycled) {
      continue;
    }

    const scrapDistance = distance(playerPosition, scrap.position);
    if (scrapDistance <= nearestDistance) {
      nearest = { kind: 'scrap', item: scrap, distance: scrapDistance };
      nearestDistance = scrapDistance;
    }
  }

  for (const soil of soils) {
    if (soil.collected) {
      continue;
    }

    const soilDistance = distance(playerPosition, soil.position);
    if (soilDistance <= nearestDistance) {
      nearest = { kind: 'soil', item: soil, distance: soilDistance };
      nearestDistance = soilDistance;
    }
  }

  for (const plant of plants) {
    if (!plant.knocked) {
      continue;
    }

    const plantDistance = distance(playerPosition, plant.position);
    if (plantDistance <= nearestDistance) {
      nearest = { kind: 'plant', item: plant, distance: plantDistance };
      nearestDistance = plantDistance;
    }
  }

  for (const poop of poops) {
    if (poop.collected) {
      continue;
    }

    const poopDistance = distance(playerPosition, poop.position);
    if (poopDistance <= nearestDistance) {
      nearest = { kind: 'poop', item: poop, distance: poopDistance };
      nearestDistance = poopDistance;
    }
  }

  return nearest;
}
