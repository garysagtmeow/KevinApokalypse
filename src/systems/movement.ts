export type Vector2 = { x: number; y: number };

export type Bounds = { width: number; height: number };

export type EntitySize = { width: number; height: number };

export type BoundsInsets = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export function clampToBounds(
  position: Vector2,
  bounds: Bounds,
  entitySize: EntitySize,
  insets: BoundsInsets = {},
): Vector2 {
  const minX = insets.left ?? entitySize.width / 2;
  const maxX = bounds.width - (insets.right ?? entitySize.width / 2);
  const minY = insets.top ?? entitySize.height / 2;
  const maxY = bounds.height - (insets.bottom ?? entitySize.height / 2);

  return {
    x: Math.max(minX, Math.min(maxX, position.x)),
    y: Math.max(minY, Math.min(maxY, position.y)),
  };
}

export function applyMovement(
  position: Vector2,
  direction: Vector2,
  speed: number,
  deltaSeconds: number,
): Vector2 {
  return {
    x: position.x + direction.x * speed * deltaSeconds,
    y: position.y + direction.y * speed * deltaSeconds,
  };
}
