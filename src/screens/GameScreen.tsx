import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import {
  ActionButton,
  GameOverOverlay,
  KevinKnast,
  KevinKnastBars,
  LevelCompleteOverlay,
  BonusUnlockOverlay,
  MiefAlarmBanner,
  MiefGasClouds,
  DirtCounter,
  PaperScrapCounter,
  PlantCounter,
  PoopCounter,
  StickFigure,
  TimmyChokingBanner,
  TimmyEmergencyOverlay,
  TimmyFartCloud,
  TimmyRescueButton,
  TimmyRescueCounter,
  TimmySpeechBubble,
  TimmySteakPlate,
  TutorialHint,
  VirtualJoystick,
} from '@/src/components';
import {
  createBoxesFromBounds,
  createPlantsFromBounds,
  createScrapsForKnockedBox,
  createSoilForKnockedPlant,
  getLevelConfig,
  getLevelScrapGoal,
  markBoxesCleared,
  Kevin,
  CardboardBox,
  LivingRoomPlant,
  PaperScrapPile,
  PoopPile,
  SoilPile,
  type BoxItem,
  type LevelId,
  type PaperScrapItem,
  type PlantItem,
  type PoopItem,
  type SoilItem,
} from '@/src/entities';
import { CHARACTER_HEADS, CHARACTER_VISUALS } from '@/src/entities/character-assets';
import { useGameSounds } from '@/src/hooks/use-game-sounds';
import { useKevin } from '@/src/hooks/use-kevin';
import { usePlayerMovement } from '@/src/hooks/use-player-movement';
import { useMiefMeter } from '@/src/hooks/use-mief-meter';
import { useTimmyFart, TIMMY_FART_MIEF_SPIKE } from '@/src/hooks/use-timmy-fart';
import { useTimmyRescueHold } from '@/src/hooks/use-timmy-rescue-hold';
import { useTimmySpeech } from '@/src/hooks/use-timmy-speech';
import { useTimmySteakChoking } from '@/src/hooks/use-timmy-steak-choking';
import {
  findNearestGameTarget,
  getMiefColor,
  clampToBounds,
  type Bounds,
  type Vector2,
} from '@/src/systems';
import { TIMMY_RESCUE_SUCCESS_QUOTE } from '@/src/systems/timmy-rescue';

const EMI_SIZE = { width: 135, height: 205 };
const EMI_BOUNDS_INSETS = { bottom: 8, top: 20, left: 24, right: 24 };
const INTERACTION_RADIUS = 72;
const RESCUE_SUCCESS_BUBBLE_MS = 3200;

type GameOverReason = 'mief' | 'choke' | null;

const EMI_VISUAL = CHARACTER_VISUALS.emi;
const TIMMY_VISUAL = CHARACTER_VISUALS.timmy;

function BadChair() {
  return (
    <View style={styles.chair}>
      <View style={[styles.chairPart, styles.chairBack]} />
      <View style={[styles.chairPart, styles.chairSeat]} />
      <View style={[styles.chairPart, styles.chairLegLeft]} />
      <View style={[styles.chairPart, styles.chairLegRight]} />
    </View>
  );
}

function BadRoomPalm() {
  return (
    <View style={styles.roomPalm}>
      <View style={[styles.palmPart, styles.palmPot]} />
      <View style={[styles.palmPart, styles.palmPotRim]} />
      <View style={[styles.palmPart, styles.palmSoil]} />
      <View style={[styles.palmPart, styles.palmStem]} />
      <View style={[styles.palmPart, styles.palmFrond, styles.palmFrondLeft]} />
      <View style={[styles.palmPart, styles.palmFrond, styles.palmFrondLeftMid]} />
      <View style={[styles.palmPart, styles.palmFrond, styles.palmFrondCenter]} />
      <View style={[styles.palmPart, styles.palmFrond, styles.palmFrondRightMid]} />
      <View style={[styles.palmPart, styles.palmFrond, styles.palmFrondRight]} />
      <View style={[styles.palmPart, styles.palmFrondTip, styles.palmFrondTipLeft]} />
      <View style={[styles.palmPart, styles.palmFrondTip, styles.palmFrondTipRight]} />
    </View>
  );
}

export function GameScreen({ levelId = 1 }: { levelId?: LevelId }) {
  const router = useRouter();
  const levelConfig = getLevelConfig(levelId);
  const [sessionKey, setSessionKey] = useState(0);
  const [playAreaBounds, setPlayAreaBounds] = useState<Bounds | null>(null);
  const [poops, setPoops] = useState<PoopItem[]>([]);
  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [soils, setSoils] = useState<SoilItem[]>([]);
  const [boxes, setBoxes] = useState<BoxItem[]>([]);
  const [scraps, setScraps] = useState<PaperScrapItem[]>([]);
  const [collectedCount, setCollectedCount] = useState(0);
  const [plantsRightedCount, setPlantsRightedCount] = useState(0);
  const [soilCollectedCount, setSoilCollectedCount] = useState(0);
  const [kevinDropCount, setKevinDropCount] = useState(0);
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>(null);
  const [forcedTimmyBubble, setForcedTimmyBubble] = useState<string | null>(null);
  const [forcedTimmyBubbleKey, setForcedTimmyBubbleKey] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const [bonusUnlockVisible, setBonusUnlockVisible] = useState(false);
  const directionRef = useRef<Vector2>({ x: 0, y: 0 });
  const poopIdRef = useRef(0);
  const knockedPlantIdsRef = useRef<Set<string>>(new Set());
  const knockedBoxIdsRef = useRef<Set<string>>(new Set());
  const plantsRef = useRef<PlantItem[]>(plants);
  const boxesRef = useRef<BoxItem[]>(boxes);
  plantsRef.current = plants;
  boxesRef.current = boxes;
  const levelCompleteSoundPlayedRef = useRef(false);
  const gameOverSoundPlayedRef = useRef(false);
  const levelInitializedForSessionRef = useRef<number | null>(null);

  const resetLevel = useCallback(() => {
    directionRef.current = { x: 0, y: 0 };
    setGameOverReason(null);
    setForcedTimmyBubble(null);
    setBonusUnlockVisible(false);
    setSessionKey((key) => key + 1);
  }, []);

  useEffect(() => {
    setHintVisible(true);
    setBonusUnlockVisible(false);
    levelCompleteSoundPlayedRef.current = false;
    gameOverSoundPlayedRef.current = false;
  }, [sessionKey]);

  useEffect(() => {
    if (!playAreaBounds) {
      return;
    }

    if (levelInitializedForSessionRef.current === sessionKey) {
      return;
    }

    levelInitializedForSessionRef.current = sessionKey;
    poopIdRef.current = 0;
    knockedPlantIdsRef.current = new Set();
    knockedBoxIdsRef.current = new Set();
    setCollectedCount(0);
    setPlantsRightedCount(0);
    setSoilCollectedCount(0);
    setKevinDropCount(0);
    setSoils([]);
    setScraps([]);
    setPoops(
      levelConfig.initialPoopSpawns.map((spawn, index) => ({
        id: `poop-initial-${sessionKey}-${index}`,
        position: {
          x: spawn.x * playAreaBounds.width,
          y: spawn.y * playAreaBounds.height,
        },
        collected: false,
      })),
    );
    setPlants(
      levelConfig.hasPlants
        ? createPlantsFromBounds(playAreaBounds, sessionKey, levelConfig.plantSpawns)
        : [],
    );
    setBoxes(
      levelConfig.hasCardboard
        ? createBoxesFromBounds(playAreaBounds, sessionKey, levelConfig.boxSpawns)
        : [],
    );
  }, [levelConfig, playAreaBounds, sessionKey]);

  const { interactionPoint: emiPosition, animatedStyle: emiAnimatedStyle } = usePlayerMovement(
    playAreaBounds,
    directionRef,
    {
      entitySize: EMI_SIZE,
      boundsInsets: EMI_BOUNDS_INSETS,
      speed: 200,
      resetKey: sessionKey,
    },
  );

  const hasKnockedPlants = useMemo(() => plants.some((plant) => plant.knocked), [plants]);
  const hasKnockedBoxes = useMemo(() => boxes.some((box) => box.knocked), [boxes]);

  const scrapGoalTotal = useMemo(
    () =>
      levelConfig.hasCardboard
        ? getLevelScrapGoal(levelConfig.boxSpawns.length)
        : 0,
    [levelConfig.boxSpawns.length, levelConfig.hasCardboard],
  );

  const scrapRecycledCount = useMemo(
    () => scraps.filter((scrap) => scrap.recycled).length,
    [scraps],
  );

  const uncleanedPoopCount = useMemo(
    () => poops.filter((poop) => !poop.collected).length,
    [poops],
  );

  const kevinKnastPlacement = useMemo(
    () => ({
      topRatio: levelConfig.kevinKnastTopRatio,
      topOffset: levelConfig.kevinKnastTopOffset,
    }),
    [levelConfig.kevinKnastTopOffset, levelConfig.kevinKnastTopRatio],
  );

  const {
    breathRemaining,
    isChoking,
    timmyRescued,
    completeRescue: completeTimmyRescue,
  } = useTimmySteakChoking({
    ready: levelConfig.hasSteakChoking && !hintVisible && gameOverReason === null,
    sessionKey,
    onChokeStart: () => {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
    onChokeFailed: () => {
      setGameOverReason((current) => (current === null ? 'choke' : current));
    },
  });

  const isLevelComplete = levelConfig.timmyRescueRequired
    ? timmyRescued &&
      (levelConfig.hasCardboard
        ? scrapRecycledCount >= scrapGoalTotal
        : plantsRightedCount >= levelConfig.plantGoal &&
          soilCollectedCount >= levelConfig.soilGoal)
    : levelConfig.hasCardboard
      ? scrapRecycledCount >= scrapGoalTotal
      : levelConfig.hasPlants
        ? plantsRightedCount >= levelConfig.plantGoal &&
          soilCollectedCount >= levelConfig.soilGoal
        : collectedCount >= levelConfig.poopGoal;

  const { mief, isCritical, isGameOver: isMiefGameOver, relieveOnCollect, spikeMief } = useMiefMeter(
    uncleanedPoopCount,
    sessionKey,
    !hintVisible && !isLevelComplete && gameOverReason === null,
  );

  const isGameOver = isMiefGameOver || gameOverReason === 'choke';
  const isPlaying = !isGameOver && !isLevelComplete && !hintVisible;

  useEffect(() => {
    if (isMiefGameOver && gameOverReason === null && !hintVisible) {
      setGameOverReason('mief');
      return;
    }

    if (!isMiefGameOver && gameOverReason === 'mief') {
      setGameOverReason(null);
    }
  }, [gameOverReason, hintVisible, isMiefGameOver]);

  const {
    playCollect,
    playKevinDrop,
    startAlarm,
    stopAlarm,
    playLevelComplete,
    playGameOver,
  } = useGameSounds({ isPlaying, isCritical, isChoking: isChoking && isPlaying });

  useEffect(() => {
    stopAlarm();
  }, [sessionKey, stopAlarm]);

  const handleDropPoop = useCallback(
    (position: Vector2) => {
      if (!playAreaBounds) {
        return;
      }

      setKevinDropCount((current) => {
        if (current >= levelConfig.kevinPoopSpawns) {
          return current;
        }

        const clamped = clampToBounds(
          position,
          playAreaBounds,
          { width: 36, height: 36 },
          { top: 40, bottom: 20, left: 20, right: 20 },
        );

        setPoops((poopList) => [
          ...poopList,
          {
            id: `poop-kevin-${sessionKey}-${poopIdRef.current++}`,
            position: clamped,
            collected: false,
          },
        ]);

        playKevinDrop();

        return current + 1;
      });
    },
    [levelConfig.kevinPoopSpawns, playAreaBounds, playKevinDrop, sessionKey],
  );

  const handlePlantKnock = useCallback(
    ({ plantId }: { plantId: string }) => {
      const plant = plantsRef.current.find((entry) => entry.id === plantId);
      if (
        !plant ||
        plant.knocked ||
        plant.wasKnocked ||
        knockedPlantIdsRef.current.has(plantId)
      ) {
        return;
      }

      knockedPlantIdsRef.current.add(plantId);

      setPlants((current) =>
        current.map((entry) =>
          entry.id === plantId ? { ...entry, knocked: true, wasKnocked: true } : entry,
        ),
      );
      setSoils((current) => [...current, ...createSoilForKnockedPlant(plant)]);

      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [],
  );

  const handleBoxKnock = useCallback(
    ({ boxId }: { boxId: string }) => {
      const box = boxesRef.current.find((entry) => entry.id === boxId);
      if (!box || box.knocked || box.wasKnocked || box.cleared || knockedBoxIdsRef.current.has(boxId)) {
        return;
      }

      knockedBoxIdsRef.current.add(boxId);

      setBoxes((current) =>
        current.map((entry) =>
          entry.id === boxId ? { ...entry, knocked: true, wasKnocked: true } : entry,
        ),
      );
      setScraps((current) => [...current, ...createScrapsForKnockedBox(box)]);

      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [],
  );

  const { animatedStyle: kevinAnimatedStyle } = useKevin(playAreaBounds, {
    resetKey: sessionKey,
    active: isPlaying,
    canSpawn: isPlaying && kevinDropCount < levelConfig.kevinPoopSpawns,
    onDropPoop: handleDropPoop,
    speed: levelConfig.kevinSpeed,
    directionChangeFactor: levelConfig.kevinDirectionChangeFactor,
    plantSeekChance: levelConfig.kevinPlantSeekChance,
    plantsRef: levelConfig.hasPlants ? plantsRef : undefined,
    onPlantKnock: levelConfig.hasPlants ? handlePlantKnock : undefined,
    boxSeekChance: levelConfig.kevinBoxSeekChance,
    boxesRef: levelConfig.hasCardboard ? boxesRef : undefined,
    onBoxKnock: levelConfig.hasCardboard ? handleBoxKnock : undefined,
    knastPlacement: kevinKnastPlacement,
    plantKnockCooldownMs: levelConfig.plantKnockCooldownMs,
    boxKnockCooldownMs: levelConfig.boxKnockCooldownMs,
    poopSpawnIntervalMinMs: levelConfig.kevinPoopSpawnIntervalMinMs,
    poopSpawnIntervalMaxMs: levelConfig.kevinPoopSpawnIntervalMaxMs,
  });

  const timmySpeechContext = useMemo(
    () => ({
      miefHigh: isCritical || mief >= 65,
      miefCritical: isCritical || mief >= 80,
      plantsOverturned: levelConfig.timmyPlantsOverturned && hasKnockedPlants,
      cardboardChaos: levelConfig.timmyCardboardChaos && hasKnockedBoxes,
      isChoking,
      preferLevel3MiefQuotes: levelConfig.id === 3 && !isChoking,
      steakEating: levelConfig.showTimmySteak && !isChoking,
    }),
    [
      hasKnockedPlants,
      hasKnockedBoxes,
      isChoking,
      isCritical,
      levelConfig.id,
      levelConfig.showTimmySteak,
      levelConfig.timmyPlantsOverturned,
      levelConfig.timmyCardboardChaos,
      mief,
    ],
  );

  const handleTimmyFart = useCallback(() => {
    spikeMief(TIMMY_FART_MIEF_SPIKE);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [spikeMief]);

  const { fartKey: timmyFartKey, isFarting: isTimmyFarting } = useTimmyFart({
    active: isPlaying,
    sessionKey,
    onFart: handleTimmyFart,
  });

  const { bubbleText: timmyBubbleText, bubbleKey: timmyBubbleKey } = useTimmySpeech({
    active: isPlaying && forcedTimmyBubble === null,
    suppressSpawns: isTimmyFarting,
    context: timmySpeechContext,
    sessionKey,
  });

  const showTimmyRescueButton = isChoking && !timmyRescued && isPlaying;

  const handleRescueComplete = useCallback(() => {
    completeTimmyRescue();
    setForcedTimmyBubble(TIMMY_RESCUE_SUCCESS_QUOTE);
    setForcedTimmyBubbleKey((key) => key + 1);
    playCollect();
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [completeTimmyRescue, playCollect]);

  const {
    progress: rescueProgress,
    isHolding: isRescueHolding,
    startHold: startRescueHold,
    cancelHold: cancelRescueHold,
  } = useTimmyRescueHold({
    enabled: showTimmyRescueButton && isPlaying,
    onComplete: handleRescueComplete,
  });

  useEffect(() => {
    if (!forcedTimmyBubble) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setForcedTimmyBubble(null);
    }, RESCUE_SUCCESS_BUBBLE_MS);

    return () => clearTimeout(timer);
  }, [forcedTimmyBubble, forcedTimmyBubbleKey]);

  const activeTarget = useMemo(
    () =>
      findNearestGameTarget(emiPosition, poops, soils, plants, INTERACTION_RADIUS, {
        scraps,
      }),
    [emiPosition, plants, poops, scraps, soils],
  );

  useEffect(() => {
    if (isLevelComplete && !isGameOver && !levelCompleteSoundPlayedRef.current) {
      levelCompleteSoundPlayedRef.current = true;
      playLevelComplete();
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [isLevelComplete, isGameOver, playLevelComplete]);

  useEffect(() => {
    if (isGameOver && !gameOverSoundPlayedRef.current) {
      gameOverSoundPlayedRef.current = true;
      playGameOver();
    }
  }, [isGameOver, playGameOver]);

  useEffect(() => {
    if ((isCritical || isChoking) && isPlaying) {
      startAlarm();
      return;
    }

    stopAlarm();
  }, [isChoking, isCritical, isPlaying, startAlarm, stopAlarm]);

  const handlePlayAreaLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPlayAreaBounds((current) => {
      if (current?.width === width && current?.height === height) {
        return current;
      }

      return { width, height };
    });
  }, []);

  const handleDirectionChange = useCallback(
    (direction: Vector2) => {
      if (!isPlaying || isRescueHolding) {
        directionRef.current = { x: 0, y: 0 };
        return;
      }

      directionRef.current = direction;
    },
    [isPlaying, isRescueHolding],
  );

  const handleAction = useCallback(() => {
    if (!isPlaying || !activeTarget) {
      return;
    }

    if (activeTarget.kind === 'poop') {
      setPoops((current) =>
        current.map((poop) =>
          poop.id === activeTarget.item.id ? { ...poop, collected: true } : poop,
        ),
      );
      setCollectedCount((count) => count + 1);
      relieveOnCollect();
      playCollect();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    if (activeTarget.kind === 'soil') {
      setSoils((current) =>
        current.map((soil) =>
          soil.id === activeTarget.item.id ? { ...soil, collected: true } : soil,
        ),
      );
      setSoilCollectedCount((count) => count + 1);
      playCollect();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    if (activeTarget.kind === 'scrap') {
      let nextScraps: PaperScrapItem[] = [];

      setScraps((current) => {
        nextScraps = current.map((scrap) =>
          scrap.id === activeTarget.item.id ? { ...scrap, recycled: true } : scrap,
        );
        return nextScraps;
      });
      setBoxes((current) => markBoxesCleared(current, nextScraps));
      playCollect();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    if (activeTarget.kind === 'plant') {
      setPlants((current) =>
        current.map((plant) =>
          plant.id === activeTarget.item.id ? { ...plant, knocked: false } : plant,
        ),
      );
      setPlantsRightedCount((count) => count + 1);
      playCollect();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [activeTarget, isPlaying, playCollect, relieveOnCollect]);

  const handleRestart = useCallback(() => {
    resetLevel();
  }, [resetLevel]);

  const handleNextLevel = useCallback(() => {
    if (levelConfig.nextLevelRoute) {
      router.replace(levelConfig.nextLevelRoute);
    }
  }, [levelConfig.nextLevelRoute, router]);

  useEffect(() => {
    if (!isLevelComplete || isGameOver || levelId !== 3) {
      return;
    }

    const timer = setTimeout(() => {
      setBonusUnlockVisible(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isGameOver, isLevelComplete, levelId, sessionKey]);

  const handleBonusLevel = useCallback(() => {
    router.replace('/bonus');
  }, [router]);

  const levelCompleteSecondaryAction =
    levelId === 3
      ? null
      : levelConfig.bonusLevelRoute
        ? { variant: 'bonus' as const, onPress: handleBonusLevel }
        : levelConfig.nextLevelRoute
          ? { variant: 'next' as const, onPress: handleNextLevel }
          : null;

  const gameOverTitle =
    gameOverReason === 'mief'
      ? levelConfig.gameOverMiefTitle
      : gameOverReason === 'choke'
        ? levelConfig.gameOverChokeTitle
        : levelConfig.gameOverTitle;
  const gameOverSubtitle =
    gameOverReason === 'mief'
      ? levelConfig.gameOverMiefSubtitle
      : gameOverReason === 'choke'
        ? levelConfig.gameOverChokeSubtitle
        : levelConfig.gameOverSubtitle;
  const displayedTimmyBubble = forcedTimmyBubble ?? timmyBubbleText;
  const displayedTimmyBubbleKey = forcedTimmyBubble
    ? `timmy-forced-${forcedTimmyBubbleKey}`
    : `timmy-speech-${timmyBubbleKey}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hud}>
        <View style={styles.hudLeftBlock}>
          <Text style={[styles.hudText, styles.hudLeft, { color: getMiefColor(mief) }]}>
            Mief-O-Meter {mief} %
          </Text>
          <View style={styles.miefBarTrack}>
            <View
              style={[
                styles.miefBarFill,
                {
                  width: `${mief}%`,
                  backgroundColor: getMiefColor(mief),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.titleBlock}>
          <View style={styles.titleBox}>
            <Text style={styles.levelTitle}>{levelConfig.title}</Text>
            <Text style={styles.levelSubtitle}>&quot;{levelConfig.subtitle}&quot;</Text>
          </View>
        </View>

        <View style={styles.hudRightBlock}>
          {levelConfig.timmyRescueRequired ? (
            <>
              <TimmyRescueCounter rescued={timmyRescued} />
              {levelConfig.hasCardboard ? (
                <PaperScrapCounter
                  recycled={scrapRecycledCount}
                  total={scrapGoalTotal}
                />
              ) : (
                <>
                  <PlantCounter rescued={plantsRightedCount} total={levelConfig.plantGoal} />
                  <DirtCounter collected={soilCollectedCount} total={levelConfig.soilGoal} />
                </>
              )}
            </>
          ) : levelConfig.hasPlants ? (
            <>
              <PlantCounter rescued={plantsRightedCount} total={levelConfig.plantGoal} />
              <DirtCounter collected={soilCollectedCount} total={levelConfig.soilGoal} />
            </>
          ) : (
            <PoopCounter collected={collectedCount} total={levelConfig.poopGoal} />
          )}
        </View>
      </View>

      <View style={styles.playArea} onLayout={handlePlayAreaLayout}>
        {playAreaBounds && (
          <KevinKnast bounds={playAreaBounds} placement={kevinKnastPlacement} />
        )}

        {playAreaBounds && <Kevin animatedStyle={kevinAnimatedStyle} />}

        {playAreaBounds && (
          <KevinKnastBars bounds={playAreaBounds} placement={kevinKnastPlacement} />
        )}

        {isChoking && <TimmyChokingBanner breathRemaining={breathRemaining} />}

        <View style={[styles.timmySpot, { top: 4 + levelConfig.timmySpotTopOffset }]}>
          <BadChair />
          {levelConfig.showTimmyPalm && <BadRoomPalm />}
          {isTimmyFarting && <TimmyFartCloud key={`timmy-fart-${timmyFartKey}`} />}
          {displayedTimmyBubble && (
            <TimmySpeechBubble
              key={displayedTimmyBubbleKey}
              text={displayedTimmyBubble}
              top={levelConfig.timmySpeechBubbleTop}
            />
          )}
          <TimmyEmergencyOverlay active={isChoking} />
          <StickFigure
            {...TIMMY_VISUAL}
            head={isChoking ? CHARACTER_HEADS.timmyBlau : TIMMY_VISUAL.head}
            labelStyle={styles.timmyLabel}
            style={styles.timmyFigure}
            headTilt={8}
          />
          {levelConfig.showTimmySteak && (
            <TimmySteakPlate visible={!isChoking || timmyRescued} />
          )}
        </View>

        {boxes.map((box, index) => (
          <CardboardBox
            key={box.id}
            x={box.position.x}
            y={box.position.y}
            knocked={box.knocked}
            variant={(index % 3) as 0 | 1 | 2}
          />
        ))}

        {scraps.map(
          (scrap, index) =>
            !scrap.recycled && (
              <PaperScrapPile
                key={scrap.id}
                x={scrap.position.x}
                y={scrap.position.y}
                index={index}
              />
            ),
        )}

        {plants.map((plant, index) => (
          <LivingRoomPlant
            key={plant.id}
            x={plant.position.x}
            y={plant.position.y}
            knocked={plant.knocked}
            variant={(index % 3) as 0 | 1 | 2}
          />
        ))}

        {soils.map(
          (soil, index) =>
            !soil.collected && (
              <SoilPile key={soil.id} x={soil.position.x} y={soil.position.y} index={index} />
            ),
        )}

        {poops.map(
          (poop) =>
            !poop.collected && (
              <PoopPile key={poop.id} x={poop.position.x} y={poop.position.y} />
            ),
        )}

        <Animated.View
          style={[
            styles.emiFigure,
            { opacity: playAreaBounds ? 1 : 0 },
            emiAnimatedStyle,
          ]}>
          <StickFigure
            {...EMI_VISUAL}
            style={{ transform: [{ rotate: '-2deg' }] }}
            headTilt={-4}
          />
        </Animated.View>

        <View style={styles.controlsOverlay} pointerEvents="box-none">
          <VirtualJoystick onDirectionChange={handleDirectionChange} />
          <View style={styles.controlsRight}>
            {showTimmyRescueButton && (
              <TimmyRescueButton
                onHoldStart={startRescueHold}
                onHoldEnd={cancelRescueHold}
                active={isPlaying}
                holdProgress={rescueProgress}
                showHoldProgress={isRescueHolding}
              />
            )}
            <ActionButton
              onPress={handleAction}
              active={isPlaying && activeTarget !== null}
            />
          </View>
        </View>

        {isCritical && isPlaying && (
          <>
            <MiefGasClouds />
            <MiefAlarmBanner />
          </>
        )}
      </View>

      {hintVisible && (
        <TutorialHint
          sessionKey={sessionKey}
          message={levelConfig.tutorialMessage}
          onDismiss={() => setHintVisible(false)}
        />
      )}

      {isLevelComplete && !isGameOver && !bonusUnlockVisible && (
        <LevelCompleteOverlay
          title={levelConfig.levelCompleteTitle}
          subtitle={levelConfig.levelCompleteSubtitle}
          onRestart={handleRestart}
          secondaryAction={levelCompleteSecondaryAction}
        />
      )}

      {isLevelComplete && !isGameOver && bonusUnlockVisible && levelId === 3 && (
        <BonusUnlockOverlay onStart={handleBonusLevel} />
      )}

      {isGameOver && (
        <GameOverOverlay
          title={gameOverTitle}
          subtitle={gameOverSubtitle}
          onRestart={handleRestart}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E4C8',
    position: 'relative',
  },
  hud: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  hudText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3D2914',
    fontFamily: 'Courier',
    transform: [{ rotate: '-2deg' }],
    minWidth: 100,
  },
  hudLeft: {
    textAlign: 'left',
  },
  hudLeftBlock: {
    minWidth: 130,
    transform: [{ translateY: 25 }, { translateX: -40 }],
  },
  miefBarTrack: {
    width: 120,
    height: 8,
    marginTop: 4,
    backgroundColor: 'rgba(60, 40, 20, 0.15)',
    borderWidth: 1,
    borderColor: '#3D2914',
    borderRadius: 4,
    overflow: 'hidden',
    transform: [{ rotate: '-2deg' }],
  },
  miefBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  hudRightBlock: {
    alignItems: 'flex-end',
    transform: [{ rotate: '3deg' }, { translateX: 45 }, { translateY: 20 }],
  },
  titleBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  titleBox: {
    borderWidth: 3,
    borderColor: '#3D2914',
    backgroundColor: 'rgba(255, 245, 220, 0.85)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    transform: [{ rotate: '-1deg' }, { translateY: 12 }],
    shadowColor: '#3D2914',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
  },
  levelTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2C1810',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: 'Courier',
  },
  levelSubtitle: {
    fontSize: 11,
    color: '#6B5344',
    textAlign: 'center',
    marginTop: 3,
    fontStyle: 'italic',
    transform: [{ rotate: '2deg' }],
  },
  playArea: {
    flex: 1,
    position: 'relative',
  },
  controlsOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  controlsRight: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  emiFigure: {
    position: 'absolute',
  },
  timmySpot: {
    position: 'absolute',
    top: 4,
    right: '12%',
    width: 168,
    height: 210,
  },
  chair: {
    position: 'absolute',
    top: 56,
    left: 24,
    width: 78,
    height: 64,
    transform: [{ rotate: '6deg' }, { scaleX: -1 }],
    zIndex: 1,
  },
  chairPart: {
    position: 'absolute',
    backgroundColor: '#8B6914',
    borderWidth: 2,
    borderColor: '#3D2914',
  },
  chairBack: {
    width: 14,
    height: 44,
    left: 4,
    top: 0,
    transform: [{ rotate: '-8deg' }],
  },
  chairSeat: {
    width: 58,
    height: 10,
    left: 10,
    top: 36,
    transform: [{ rotate: '4deg' }],
  },
  chairLegLeft: {
    width: 4,
    height: 18,
    left: 16,
    top: 44,
    transform: [{ rotate: '12deg' }],
  },
  chairLegRight: {
    width: 4,
    height: 16,
    left: 52,
    top: 46,
    transform: [{ rotate: '-6deg' }],
  },
  roomPalm: {
    position: 'absolute',
    top: 28,
    left: 108,
    width: 52,
    height: 118,
    transform: [{ rotate: '4deg' }],
    zIndex: 2,
  },
  palmPart: {
    position: 'absolute',
  },
  palmPot: {
    width: 34,
    height: 28,
    left: 8,
    top: 88,
    backgroundColor: '#B5651D',
    borderWidth: 2,
    borderColor: '#5D3A1A',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 4,
    transform: [{ rotate: '-5deg' }, { skewX: '8deg' }],
  },
  palmPotRim: {
    width: 38,
    height: 7,
    left: 6,
    top: 84,
    backgroundColor: '#8B4513',
    borderWidth: 2,
    borderColor: '#3D2914',
    borderRadius: 2,
    transform: [{ rotate: '-3deg' }],
  },
  palmSoil: {
    width: 28,
    height: 5,
    left: 11,
    top: 88,
    backgroundColor: '#4E342E',
    borderRadius: 2,
    transform: [{ rotate: '-4deg' }],
  },
  palmStem: {
    width: 5,
    height: 52,
    left: 23,
    top: 38,
    backgroundColor: '#6D8B3D',
    borderWidth: 2,
    borderColor: '#33691E',
    borderRadius: 2,
    transform: [{ rotate: '7deg' }],
  },
  palmFrond: {
    width: 9,
    height: 34,
    backgroundColor: '#7CB342',
    borderWidth: 2,
    borderColor: '#33691E',
    borderRadius: 5,
    top: 8,
    left: 21,
  },
  palmFrondLeft: {
    transform: [{ rotate: '-58deg' }],
    height: 30,
    backgroundColor: '#689F38',
  },
  palmFrondLeftMid: {
    transform: [{ rotate: '-28deg' }],
    height: 36,
    left: 19,
    top: 4,
  },
  palmFrondCenter: {
    transform: [{ rotate: '2deg' }],
    height: 40,
    left: 22,
    top: 0,
    backgroundColor: '#8BC34A',
  },
  palmFrondRightMid: {
    transform: [{ rotate: '32deg' }],
    height: 35,
    left: 24,
    top: 6,
  },
  palmFrondRight: {
    transform: [{ rotate: '62deg' }],
    height: 28,
    left: 26,
    top: 12,
    backgroundColor: '#689F38',
  },
  palmFrondTip: {
    width: 7,
    height: 12,
    backgroundColor: '#AED581',
    borderWidth: 2,
    borderColor: '#33691E',
    borderRadius: 4,
  },
  palmFrondTipLeft: {
    left: 2,
    top: 0,
    transform: [{ rotate: '-72deg' }],
  },
  palmFrondTipRight: {
    left: 38,
    top: 18,
    transform: [{ rotate: '78deg' }],
  },
  timmyFigure: {
    position: 'absolute',
    top: 0,
    left: 10,
    zIndex: 5,
    transform: [{ rotate: '5deg' }],
  },
  timmyLabel: {
    fontSize: 9,
    transform: [{ rotate: '4deg' }],
  },
});
