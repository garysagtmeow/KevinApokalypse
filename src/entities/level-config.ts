import type { Href } from 'expo-router';

import {
  LEVEL3_BOX_SPAWNS,
  BOX_KNOCK_COOLDOWN_MS,
} from '@/src/entities/cardboard-data';
import {
  LEVEL2_INITIAL_POOP_SPAWNS,
  LEVEL2_KEVIN_POOP_INTERVAL_MAX_MS,
  LEVEL2_KEVIN_POOP_INTERVAL_MIN_MS,
  LEVEL2_KEVIN_SPAWN_COUNT,
  LEVEL2_PLANT_COUNT,
  LEVEL2_PLANT_SPAWNS,
  LEVEL2_SOIL_GOAL,
  PLANT_KNOCK_COOLDOWN_MS,
} from '@/src/entities/plant-data';
import {
  LEVEL1_INITIAL_SPAWNS,
  LEVEL1_KEVIN_SPAWN_COUNT,
  LEVEL1_POOP_GOAL,
  LEVEL3_INITIAL_POOP_SPAWNS,
  LEVEL3_KEVIN_POOP_INTERVAL_MAX_MS,
  LEVEL3_KEVIN_POOP_INTERVAL_MIN_MS,
  LEVEL3_KEVIN_POOP_SPAWN_COUNT,
} from '@/src/entities/poop-data';
import {
  KEVIN_SPAWN_INTERVAL_MAX_MS,
  KEVIN_SPAWN_INTERVAL_MIN_MS,
} from '@/src/systems/kevin-ai';

export type LevelId = 1 | 2 | 3;

export type LevelConfig = {
  id: LevelId;
  title: string;
  subtitle: string;
  tutorialMessage: string;
  poopGoal: number;
  kevinPoopSpawns: number;
  kevinSpeed: number;
  kevinDirectionChangeFactor: number;
  kevinPlantSeekChance: number;
  plantKnockCooldownMs: number;
  kevinPoopSpawnIntervalMinMs: number;
  kevinPoopSpawnIntervalMaxMs: number;
  hasPlants: boolean;
  plantGoal: number;
  soilGoal: number;
  plantSpawns: readonly { id: string; x: number; y: number }[];
  hasCardboard: boolean;
  boxSpawns: readonly { id: string; x: number; y: number }[];
  kevinBoxSeekChance: number;
  boxKnockCooldownMs: number;
  hasSteakChoking: boolean;
  timmyRescueRequired: boolean;
  levelCompleteTitle: string;
  levelCompleteSubtitle: string;
  gameOverTitle: string;
  gameOverSubtitle: string;
  gameOverMiefTitle: string;
  gameOverMiefSubtitle: string;
  gameOverChokeTitle: string;
  gameOverChokeSubtitle: string;
  nextLevelRoute: Href | null;
  bonusLevelRoute: Href | null;
  initialPoopSpawns: { x: number; y: number }[];
  timmyPlantsOverturned: boolean;
  timmyCardboardChaos: boolean;
  showTimmyPalm: boolean;
  showTimmySteak: boolean;
  kevinKnastTopRatio: number;
  kevinKnastTopOffset: number;
  timmySpotTopOffset: number;
  timmySpeechBubbleTop: number;
};

export const LEVEL_CONFIGS: Record<LevelId, LevelConfig> = {
  1: {
    id: 1,
    title: 'LEVEL 1: DER ERSTE HAUFEN',
    subtitle: 'Kevin war das nicht.',
    tutorialMessage: 'Sammle 10 Häufchen ein, bevor das Mief-O-Meter explodiert!',
    poopGoal: LEVEL1_POOP_GOAL,
    kevinPoopSpawns: LEVEL1_KEVIN_SPAWN_COUNT,
    kevinSpeed: 110,
    kevinDirectionChangeFactor: 1,
    kevinPlantSeekChance: 0,
    plantKnockCooldownMs: 0,
    kevinPoopSpawnIntervalMinMs: KEVIN_SPAWN_INTERVAL_MIN_MS,
    kevinPoopSpawnIntervalMaxMs: KEVIN_SPAWN_INTERVAL_MAX_MS,
    hasPlants: false,
    plantGoal: 0,
    soilGoal: 0,
    plantSpawns: [],
    hasCardboard: false,
    boxSpawns: [],
    kevinBoxSeekChance: 0,
    boxKnockCooldownMs: 0,
    hasSteakChoking: false,
    timmyRescueRequired: false,
    levelCompleteTitle: 'Wohnzimmer gerettet!',
    levelCompleteSubtitle: 'Kevin war es trotzdem.',
    gameOverTitle: 'ZU MIEFIG!',
    gameOverSubtitle: 'Kevin war es doch.',
    gameOverMiefTitle: 'ZU MIEFIG!',
    gameOverMiefSubtitle: 'Kevin war es doch.',
    gameOverChokeTitle: 'ZU MIEFIG!',
    gameOverChokeSubtitle: 'Kevin war es doch.',
    nextLevelRoute: '/level2' as Href,
    bonusLevelRoute: null,
    initialPoopSpawns: LEVEL1_INITIAL_SPAWNS,
    timmyPlantsOverturned: false,
    timmyCardboardChaos: false,
    showTimmyPalm: true,
    showTimmySteak: false,
    kevinKnastTopRatio: 0.1,
    kevinKnastTopOffset: 0,
    timmySpotTopOffset: 28,
    timmySpeechBubbleTop: -17,
  },
  2: {
    id: 2,
    title: 'LEVEL 2: PFLANZENMASSAKER',
    subtitle: 'Grün war einmal.',
    tutorialMessage:
      'Stelle die Pflanzen wieder auf, beseitige die Erdhäufchen und halte das Mief-O-Meter unter Kontrolle',
    poopGoal: LEVEL1_POOP_GOAL,
    kevinPoopSpawns: LEVEL2_KEVIN_SPAWN_COUNT,
    kevinSpeed: 175,
    kevinDirectionChangeFactor: 0.45,
    kevinPlantSeekChance: 0.72,
    plantKnockCooldownMs: PLANT_KNOCK_COOLDOWN_MS,
    kevinPoopSpawnIntervalMinMs: LEVEL2_KEVIN_POOP_INTERVAL_MIN_MS,
    kevinPoopSpawnIntervalMaxMs: LEVEL2_KEVIN_POOP_INTERVAL_MAX_MS,
    hasPlants: true,
    plantGoal: LEVEL2_PLANT_COUNT,
    soilGoal: LEVEL2_SOIL_GOAL,
    plantSpawns: LEVEL2_PLANT_SPAWNS,
    hasCardboard: false,
    boxSpawns: [],
    kevinBoxSeekChance: 0,
    boxKnockCooldownMs: 0,
    hasSteakChoking: false,
    timmyRescueRequired: false,
    levelCompleteTitle: 'Die Pflanzen leben.',
    levelCompleteSubtitle: 'Ihr Vertrauen ist jedoch nachhaltig erschüttert.',
    gameOverTitle: 'Die Pflanzen haben aufgegeben.',
    gameOverSubtitle: 'Timmy übrigens auch.',
    gameOverMiefTitle: 'Die Pflanzen haben aufgegeben.',
    gameOverMiefSubtitle: 'Timmy übrigens auch.',
    gameOverChokeTitle: 'Die Pflanzen haben aufgegeben.',
    gameOverChokeSubtitle: 'Timmy übrigens auch.',
    nextLevelRoute: '/level3' as Href,
    bonusLevelRoute: null,
    initialPoopSpawns: LEVEL2_INITIAL_POOP_SPAWNS,
    timmyPlantsOverturned: true,
    timmyCardboardChaos: false,
    showTimmyPalm: false,
    showTimmySteak: false,
    kevinKnastTopRatio: 0.1,
    kevinKnastTopOffset: -24,
    timmySpotTopOffset: -24,
    timmySpeechBubbleTop: -22,
  },
  3: {
    id: 3,
    title: 'LEVEL 3: OPERATION STEAK',
    subtitle: 'Jetzt wird\'s persönlich.',
    tutorialMessage:
      'Sammle zerfetztes Papier und rette Timmy vor dem Erstickungstod. Das Mief-O-Meter darf währenddessen nicht explodieren!',
    poopGoal: 0,
    kevinPoopSpawns: LEVEL3_KEVIN_POOP_SPAWN_COUNT,
    kevinSpeed: 190,
    kevinDirectionChangeFactor: 0.45,
    kevinPlantSeekChance: 0,
    plantKnockCooldownMs: 0,
    kevinPoopSpawnIntervalMinMs: LEVEL3_KEVIN_POOP_INTERVAL_MIN_MS,
    kevinPoopSpawnIntervalMaxMs: LEVEL3_KEVIN_POOP_INTERVAL_MAX_MS,
    hasPlants: false,
    plantGoal: 0,
    soilGoal: 0,
    plantSpawns: [],
    hasCardboard: true,
    boxSpawns: LEVEL3_BOX_SPAWNS,
    kevinBoxSeekChance: 0.68,
    boxKnockCooldownMs: BOX_KNOCK_COOLDOWN_MS,
    hasSteakChoking: true,
    timmyRescueRequired: true,
    levelCompleteTitle: 'Operation erfolgreich.',
    levelCompleteSubtitle: 'Grillen wir morgen...?',
    gameOverTitle: 'Timmy hat das Steak unterschätzt.',
    gameOverSubtitle: 'Das war ein Bissen zu viel.',
    gameOverMiefTitle: 'Der Mief war stärker.',
    gameOverMiefSubtitle: 'Selbst Kevin fand\'s grenzwertig.',
    gameOverChokeTitle: 'Timmy hat das Steak unterschätzt.',
    gameOverChokeSubtitle: 'Das war ein Bissen zu viel.',
    nextLevelRoute: null,
    bonusLevelRoute: '/bonus' as Href,
    initialPoopSpawns: LEVEL3_INITIAL_POOP_SPAWNS,
    timmyPlantsOverturned: false,
    timmyCardboardChaos: true,
    showTimmyPalm: false,
    showTimmySteak: true,
    kevinKnastTopRatio: 0.1,
    kevinKnastTopOffset: -24,
    timmySpotTopOffset: -24,
    timmySpeechBubbleTop: -22,
  },
};

export function getLevelConfig(levelId: LevelId): LevelConfig {
  return LEVEL_CONFIGS[levelId];
}
