import type { Bounds, Vector2 } from '@/src/systems/movement';

export type CheeseKind = 'normal' | 'mega';

export type CheeseItem = {
  id: string;
  position: Vector2;
  kind: CheeseKind;
  expiresAt: number | null;
};

export const BONUS_DURATION_SECONDS = 30;
export const CHEESE_INTERACTION_RADIUS = 72;
export const MIN_NORMAL_CHEESE_COUNT = 1;
export const MEGA_CHEESE_LIFETIME_MS = 5500;
export const MEGA_CHEESE_POINTS = 2;
export const NORMAL_CHEESE_POINTS = 1;
export const MEGA_CHEESE_SPAWN_INTERVAL_MS = 7000;
export const MEGA_CHEESE_SPAWN_CHANCE = 0.38;
export const MAX_MEGA_CHEESE_ON_SCREEN = 1;

const SPAWN_MARGIN = { x: 0.1, y: 0.14 };
const MAX_SPAWN_ATTEMPTS = 40;

// Matches BonusScreen controlsOverlay + VirtualJoystick / ActionButton layout.
const BONUS_JOYSTICK_SIZE = 88;
const BONUS_ACTION_BUTTON_WIDTH = 190;
const BONUS_ACTION_BUTTON_HEIGHT = 64;
const BONUS_CONTROLS_PADDING_H = 24;
const BONUS_CONTROLS_PADDING_BOTTOM = 8;
const CHEESE_SPAWN_CLEARANCE = 44;

type ExclusionRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function getBonusControlExclusionRects(bounds: Bounds): ExclusionRect[] {
  const controlsBottom = bounds.height - BONUS_CONTROLS_PADDING_BOTTOM;

  return [
    {
      left: BONUS_CONTROLS_PADDING_H - CHEESE_SPAWN_CLEARANCE,
      top: controlsBottom - BONUS_JOYSTICK_SIZE - CHEESE_SPAWN_CLEARANCE,
      right: BONUS_CONTROLS_PADDING_H + BONUS_JOYSTICK_SIZE + CHEESE_SPAWN_CLEARANCE,
      bottom: controlsBottom + CHEESE_SPAWN_CLEARANCE,
    },
    {
      left:
        bounds.width -
        BONUS_CONTROLS_PADDING_H -
        BONUS_ACTION_BUTTON_WIDTH -
        CHEESE_SPAWN_CLEARANCE,
      top: controlsBottom - BONUS_ACTION_BUTTON_HEIGHT - CHEESE_SPAWN_CLEARANCE,
      right: bounds.width - BONUS_CONTROLS_PADDING_H + CHEESE_SPAWN_CLEARANCE,
      bottom: controlsBottom + CHEESE_SPAWN_CLEARANCE,
    },
  ];
}

function isPointInExclusionZone(point: Vector2, bounds: Bounds): boolean {
  return getBonusControlExclusionRects(bounds).some(
    (rect) =>
      point.x >= rect.left &&
      point.x <= rect.right &&
      point.y >= rect.top &&
      point.y <= rect.bottom,
  );
}

export function randomCheesePosition(bounds: Bounds): Vector2 {
  for (let attempt = 0; attempt < MAX_SPAWN_ATTEMPTS; attempt += 1) {
    const position = {
      x:
        SPAWN_MARGIN.x * bounds.width +
        Math.random() * bounds.width * (1 - 2 * SPAWN_MARGIN.x),
      y:
        SPAWN_MARGIN.y * bounds.height +
        Math.random() * bounds.height * (1 - 2 * SPAWN_MARGIN.y),
    };

    if (!isPointInExclusionZone(position, bounds)) {
      return position;
    }
  }

  return {
    x: bounds.width * (0.35 + Math.random() * 0.3),
    y: bounds.height * (SPAWN_MARGIN.y + Math.random() * 0.35),
  };
}

export function createCheese(
  bounds: Bounds,
  id: string,
  kind: CheeseKind = 'normal',
): CheeseItem {
  return {
    id,
    position: randomCheesePosition(bounds),
    kind,
    expiresAt:
      kind === 'mega' ? Date.now() + MEGA_CHEESE_LIFETIME_MS : null,
  };
}

export function getCheesePoints(kind: CheeseKind): number {
  return kind === 'mega' ? MEGA_CHEESE_POINTS : NORMAL_CHEESE_POINTS;
}

export function getCheeseRank(score: number): string {
  if (score <= 12) {
    return 'Käsepraktikant';
  }
  if (score <= 22) {
    return 'Gouda-Ganove';
  }
  if (score <= 32) {
    return 'Camembert-Kommando';
  }
  if (score <= 44) {
    return 'Lord of the Cheese';
  }
  return 'Kevin, Bezwinger der Käseplatte';
}

export function findNearestCheese(
  playerPosition: Vector2,
  cheeses: CheeseItem[],
  radius: number,
): CheeseItem | null {
  let nearest: CheeseItem | null = null;
  let nearestDistance = radius;

  for (const cheese of cheeses) {
    const cheeseDistance = Math.hypot(
      playerPosition.x - cheese.position.x,
      playerPosition.y - cheese.position.y,
    );
    if (cheeseDistance <= nearestDistance) {
      nearest = cheese;
      nearestDistance = cheeseDistance;
    }
  }

  return nearest;
}
