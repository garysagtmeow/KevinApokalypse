export const CHARACTER_HEADS = {
  emi: require('@/assets/game/characters/heads/emi.png'),
  timmy: require('@/assets/game/characters/heads/timmy.png'),
  timmyBlau: require('@/assets/game/characters/heads/timmyblau.png'),
  kevin: require('@/assets/game/characters/heads/kevin.png'),
} as const;

export const CHARACTER_BODIES = {
  emiStanding: require('@/assets/game/characters/bodies/emi-standing.png'),
  timmySitting: require('@/assets/game/characters/bodies/timmy-sitting.png'),
  kevinDog: require('@/assets/game/characters/bodies/kevin-dog.png'),
} as const;

export const CHARACTER_VISUALS = {
  emi: {
    head: CHARACTER_HEADS.emi,
    body: CHARACTER_BODIES.emiStanding,
    headSize: 150,
    bodyWidth: 72,
    bodyHeight: 90,
    bodyOffsetY: -78,
    label: 'EMI',
  },
  timmy: {
    head: CHARACTER_HEADS.timmy,
    body: CHARACTER_BODIES.timmySitting,
    headSize: 108,
    bodyWidth: 58,
    bodyHeight: 72,
    bodyOffsetY: -48,
    label: 'ZAHNARZT TIMMY',
  },
  kevin: {
    head: CHARACTER_HEADS.kevin,
    body: CHARACTER_BODIES.kevinDog,
    headSize: 75,
    headOffsetY: 15,
    bodyWidth: 52,
    bodyHeight: 48,
    bodyOffsetY: -30,
    label: 'KEVIN',
  },
} as const;
