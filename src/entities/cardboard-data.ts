export type BoxItem = {
  id: string;
  position: { x: number; y: number };
  knocked: boolean;
  wasKnocked: boolean;
  cleared: boolean;
};

export type PaperScrapItem = {
  id: string;
  boxId: string;
  position: { x: number; y: number };
  recycled: boolean;
};

export const LEVEL3_SCRAPS_PER_BOX = 4;

export function getLevelScrapGoal(boxCount: number): number {
  return boxCount * LEVEL3_SCRAPS_PER_BOX;
}

export const KEVIN_BOX_HIT_RADIUS = 44;
export const BOX_HIT_RADIUS = 36;
export const BOX_KNOCK_COOLDOWN_MS = 1500;

export const LEVEL3_BOX_SPAWNS = [
  { id: 'box-a', x: 0.22, y: 0.38 },
  { id: 'box-b', x: 0.36, y: 0.52 },
  { id: 'box-c', x: 0.5, y: 0.3 },
  { id: 'box-d', x: 0.62, y: 0.44 },
] as const;

export function createBoxesFromBounds(
  bounds: { width: number; height: number },
  sessionKey: number,
  spawns: readonly { id: string; x: number; y: number }[] = LEVEL3_BOX_SPAWNS,
): BoxItem[] {
  return spawns.map((spawn) => ({
    id: `${spawn.id}-${sessionKey}`,
    position: {
      x: spawn.x * bounds.width,
      y: spawn.y * bounds.height,
    },
    knocked: false,
    wasKnocked: false,
    cleared: false,
  }));
}

export function markBoxesCleared(boxes: BoxItem[], scraps: PaperScrapItem[]): BoxItem[] {
  return boxes.map((box) => {
    if (box.cleared) {
      return box;
    }

    const boxScraps = scraps.filter((scrap) => scrap.boxId === box.id);
    if (
      boxScraps.length >= LEVEL3_SCRAPS_PER_BOX &&
      boxScraps.every((scrap) => scrap.recycled)
    ) {
      return { ...box, cleared: true };
    }

    return box;
  });
}

export function createScrapsForKnockedBox(box: BoxItem): PaperScrapItem[] {
  const pileCount = LEVEL3_SCRAPS_PER_BOX;
  const radiusX = 34;
  const radiusY = 22;

  return Array.from({ length: pileCount }, (_, index) => {
    const angle = (index / pileCount) * Math.PI * 2 + 0.6;
    return {
      id: `${box.id}-scrap-${index}`,
      boxId: box.id,
      position: {
        x: box.position.x + Math.cos(angle) * radiusX,
        y: box.position.y + Math.sin(angle) * radiusY + 14,
      },
      recycled: false,
    };
  });
}
