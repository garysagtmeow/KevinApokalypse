import type { Bounds, Vector2 } from '@/src/systems/movement';

export const KEVIN_KNAST_LAYOUT = {
  left: 10,
  topRatio: 0.1,
  width: 98,
  height: 132,
} as const;

export type KevinKnastPlacement = {
  topRatio?: number;
  topOffset?: number;
};

export function getKevinKnastTop(
  bounds: Bounds,
  placement: KevinKnastPlacement = {},
): number {
  const topRatio = placement.topRatio ?? KEVIN_KNAST_LAYOUT.topRatio;
  const topOffset = placement.topOffset ?? 0;
  return bounds.height * topRatio + topOffset;
}

export function getKevinKnastSpawn(
  bounds: Bounds,
  placement: KevinKnastPlacement = {},
): Vector2 {
  const top = getKevinKnastTop(bounds, placement);
  return {
    x: KEVIN_KNAST_LAYOUT.left + KEVIN_KNAST_LAYOUT.width * 0.5,
    y: top + KEVIN_KNAST_LAYOUT.height * 0.46,
  };
}
