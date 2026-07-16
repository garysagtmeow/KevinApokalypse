export type BoundsInsets = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export function clampMief(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function computeMiefRise(uncleanedPoopCount: number, deltaSeconds: number): number {
  if (uncleanedPoopCount === 0) {
    return 0;
  }

  const risePerPoopPerSecond = 1.8;
  return uncleanedPoopCount * risePerPoopPerSecond * deltaSeconds;
}

export const MIEF_COLLECT_RELIEF = 10;

export function getMiefColor(mief: number): string {
  if (mief >= 80) {
    return '#B71C1C';
  }
  if (mief >= 50) {
    return '#E65100';
  }
  if (mief >= 25) {
    return '#F9A825';
  }
  return '#3D2914';
}
