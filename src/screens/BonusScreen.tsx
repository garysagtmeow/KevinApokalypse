import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import {
  ActionButton,
  BonusEndOverlay,
  KevinKnast,
  KevinKnastBars,
  ScorePopup,
  TutorialHint,
  VirtualJoystick,
} from '@/src/components';
import {
  BONUS_DURATION_SECONDS,
  CHEESE_INTERACTION_RADIUS,
  MAX_MEGA_CHEESE_ON_SCREEN,
  MEGA_CHEESE_SPAWN_CHANCE,
  MEGA_CHEESE_SPAWN_INTERVAL_MS,
  MIN_NORMAL_CHEESE_COUNT,
  createCheese,
  findNearestCheese,
  getCheesePoints,
  getCheeseRank,
  type CheeseItem,
} from '@/src/entities/cheese-data';
import { CheeseWedge } from '@/src/entities/CheeseWedge';
import { Kevin, KEVIN_ENTITY_SIZE } from '@/src/entities/Kevin';
import { useBonusTimer } from '@/src/hooks/use-bonus-timer';
import { useBonusSounds } from '@/src/hooks/use-bonus-sounds';
import { usePlayerMovement } from '@/src/hooks/use-player-movement';
import { type Bounds, type Vector2 } from '@/src/systems';

const KEVIN_BONUS_SPEED = 250;
const BONUS_TUTORIAL_MESSAGE =
  'Flitze mit Kevin zu den Käseecken und vernichte sie! Sammle in 30 Sekunden so viele Käseecken wie möglich. Gold glänzende Goudas geben Extra-Punkte!';
const KEVIN_BOUNDS_INSETS = { bottom: 8, top: 20, left: 24, right: 24 };
const KEVIN_KNAST_PLACEMENT = { topRatio: 0.14, topOffset: 10 };

type ScorePopupItem = {
  id: string;
  text: string;
  x: number;
  y: number;
};

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
      <View style={[styles.palmPart, styles.palmFrond, styles.palmFrondCenter]} />
      <View style={[styles.palmPart, styles.palmFrond, styles.palmFrondRight]} />
    </View>
  );
}

export function BonusScreen() {
  const router = useRouter();
  const [sessionKey, setSessionKey] = useState(0);
  const [playAreaBounds, setPlayAreaBounds] = useState<Bounds | null>(null);
  const [cheeses, setCheeses] = useState<CheeseItem[]>([]);
  const [score, setScore] = useState(0);
  const [popups, setPopups] = useState<ScorePopupItem[]>([]);
  const [hintVisible, setHintVisible] = useState(true);
  const directionRef = useRef<Vector2>({ x: 0, y: 0 });
  const cheeseIdRef = useRef(0);
  const popupIdRef = useRef(0);
  const initializedRef = useRef<number | null>(null);

  const { remaining, finished } = useBonusTimer(
    BONUS_DURATION_SECONDS,
    !hintVisible,
    sessionKey,
  );
  const isPlaying = !finished && !hintVisible;
  const { playCheesePling } = useBonusSounds(isPlaying, sessionKey);

  const resetSession = useCallback(() => {
    directionRef.current = { x: 0, y: 0 };
    cheeseIdRef.current = 0;
    popupIdRef.current = 0;
    setScore(0);
    setPopups([]);
    setCheeses([]);
    setHintVisible(true);
    setSessionKey((key) => key + 1);
  }, []);

  const kevinPosition = usePlayerMovement(playAreaBounds, directionRef, {
    entitySize: KEVIN_ENTITY_SIZE,
    boundsInsets: KEVIN_BOUNDS_INSETS,
    speed: KEVIN_BONUS_SPEED,
    resetKey: sessionKey,
  });

  useEffect(() => {
    if (!playAreaBounds || initializedRef.current === sessionKey) {
      return;
    }

    initializedRef.current = sessionKey;
    setCheeses(
      Array.from({ length: MIN_NORMAL_CHEESE_COUNT }, () =>
        createCheese(playAreaBounds, `cheese-${sessionKey}-${cheeseIdRef.current++}`, 'normal'),
      ),
    );
  }, [playAreaBounds, sessionKey]);

  useEffect(() => {
    if (!isPlaying || !playAreaBounds) {
      return;
    }

    const interval = setInterval(() => {
      setCheeses((current) => {
        const megaCount = current.filter((cheese) => cheese.kind === 'mega').length;
        if (megaCount >= MAX_MEGA_CHEESE_ON_SCREEN || Math.random() > MEGA_CHEESE_SPAWN_CHANCE) {
          return current;
        }

        return [
          ...current,
          createCheese(playAreaBounds, `cheese-mega-${sessionKey}-${cheeseIdRef.current++}`, 'mega'),
        ];
      });
    }, MEGA_CHEESE_SPAWN_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPlaying, playAreaBounds, sessionKey]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setCheeses((current) =>
        current.filter((cheese) => !cheese.expiresAt || cheese.expiresAt > now),
      );
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (finished) {
      directionRef.current = { x: 0, y: 0 };
    }
  }, [finished]);

  const activeCheese = useMemo(
    () => findNearestCheese(kevinPosition, cheeses, CHEESE_INTERACTION_RADIUS),
    [cheeses, kevinPosition],
  );

  const handlePlayAreaLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setPlayAreaBounds((current) =>
      current?.width === width && current?.height === height ? current : { width, height },
    );
  }, []);

  const handleDirectionChange = useCallback(
    (direction: Vector2) => {
      if (!isPlaying) {
        directionRef.current = { x: 0, y: 0 };
        return;
      }
      directionRef.current = direction;
    },
    [isPlaying],
  );

  const handleAction = useCallback(() => {
    if (!isPlaying || !activeCheese || !playAreaBounds) {
      return;
    }

    const collectedCheese = activeCheese;
    const points = getCheesePoints(collectedCheese.kind);
    const popupText = `+${points}`;

    setScore((current) => current + points);
    setPopups((current) => [
      ...current,
      {
        id: `popup-${popupIdRef.current++}`,
        text: popupText,
        x: collectedCheese.position.x,
        y: collectedCheese.position.y,
      },
    ]);

    setCheeses((current) => {
      const next = current.filter((cheese) => cheese.id !== collectedCheese.id);
      if (collectedCheese.kind !== 'normal') {
        return next;
      }

      return [
        ...next,
        createCheese(playAreaBounds, `cheese-${sessionKey}-${cheeseIdRef.current++}`, 'normal'),
      ];
    });

    playCheesePling();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [activeCheese, isPlaying, playAreaBounds, playCheesePling, sessionKey]);

  const removePopup = useCallback((id: string) => {
    setPopups((current) => current.filter((popup) => popup.id !== id));
  }, []);

  const rank = useMemo(() => getCheeseRank(score), [score]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hud}>
        <View style={styles.hudLeftBlock}>
          <Text style={styles.timerText}>{remaining}s</Text>
          <View style={styles.timerTrack}>
            <View
              style={[
                styles.timerFill,
                { width: `${(remaining / BONUS_DURATION_SECONDS) * 100}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.titleBlock}>
          <View style={styles.titleBox}>
            <Text style={styles.levelTitle}>KEVIN UNCHAINED</Text>
            <Text style={styles.levelSubtitle}>&quot;30 Sekunden. Kein Gewissen. Nur Käse.&quot;</Text>
          </View>
        </View>

        <View style={styles.hudRightBlock}>
          <Text style={styles.scoreLabel}>Käse</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
      </View>

      <View style={styles.playArea} onLayout={handlePlayAreaLayout}>
        {playAreaBounds && (
          <KevinKnast bounds={playAreaBounds} placement={KEVIN_KNAST_PLACEMENT} />
        )}

        {playAreaBounds && (
          <KevinKnastBars bounds={playAreaBounds} placement={KEVIN_KNAST_PLACEMENT} />
        )}

        <View style={styles.roomDecor}>
          <BadChair />
          <BadRoomPalm />
        </View>

        {cheeses.map((cheese) => (
          <CheeseWedge
            key={cheese.id}
            x={cheese.position.x}
            y={cheese.position.y}
            kind={cheese.kind}
          />
        ))}

        {playAreaBounds && (
          <Kevin position={kevinPosition} innocent={finished} />
        )}

        {popups.map((popup) => (
          <ScorePopup
            key={popup.id}
            text={popup.text}
            x={popup.x}
            y={popup.y}
            onDone={() => removePopup(popup.id)}
          />
        ))}

        <View style={styles.controlsOverlay} pointerEvents="box-none">
          <VirtualJoystick onDirectionChange={handleDirectionChange} />
          <ActionButton
            onPress={handleAction}
            active={isPlaying && activeCheese !== null}
            label="Käse vernichten!"
          />
        </View>
      </View>

      {hintVisible && (
        <TutorialHint
          sessionKey={sessionKey}
          message={BONUS_TUTORIAL_MESSAGE}
          onDismiss={() => setHintVisible(false)}
        />
      )}

      {finished && (
        <BonusEndOverlay
          score={score}
          rank={rank}
          onReplay={resetSession}
          onMenu={() => router.replace('/')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E4C8',
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
  hudLeftBlock: {
    minWidth: 100,
    transform: [{ translateY: 20 }, { translateX: -20 }],
  },
  timerText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#E65100',
    fontFamily: 'Courier',
    transform: [{ rotate: '-3deg' }],
  },
  timerTrack: {
    width: 100,
    height: 8,
    marginTop: 4,
    backgroundColor: 'rgba(60, 40, 20, 0.15)',
    borderWidth: 1,
    borderColor: '#3D2914',
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 3,
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
    borderColor: '#E6A800',
    backgroundColor: 'rgba(255, 248, 220, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    transform: [{ rotate: '-1deg' }, { translateY: 12 }],
  },
  levelTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#E65100',
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: 'Courier',
  },
  levelSubtitle: {
    fontSize: 10,
    color: '#6B5344',
    textAlign: 'center',
    marginTop: 3,
    fontStyle: 'italic',
    fontFamily: 'Courier',
  },
  hudRightBlock: {
    alignItems: 'flex-end',
    transform: [{ rotate: '3deg' }, { translateX: 30 }, { translateY: 18 }],
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B5344',
    fontFamily: 'Courier',
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFC107',
    fontFamily: 'Courier',
    textShadowColor: '#5D4037',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  playArea: {
    flex: 1,
    position: 'relative',
  },
  roomDecor: {
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
    borderRadius: 4,
  },
  palmPotRim: {
    width: 38,
    height: 6,
    left: 6,
    top: 86,
    backgroundColor: '#8B4513',
    borderWidth: 1,
    borderColor: '#5D3A1A',
    borderRadius: 2,
  },
  palmSoil: {
    width: 28,
    height: 5,
    left: 11,
    top: 88,
    backgroundColor: '#4E342E',
    borderRadius: 2,
  },
  palmStem: {
    width: 6,
    height: 52,
    left: 22,
    top: 36,
    backgroundColor: '#558B2F',
    borderWidth: 1,
    borderColor: '#33691E',
  },
  palmFrond: {
    width: 4,
    height: 38,
    backgroundColor: '#689F38',
    borderWidth: 1,
    borderColor: '#33691E',
    borderRadius: 2,
  },
  palmFrondLeft: {
    left: 10,
    top: 18,
    transform: [{ rotate: '-42deg' }],
  },
  palmFrondCenter: {
    left: 23,
    top: 8,
    height: 44,
    transform: [{ rotate: '0deg' }],
  },
  palmFrondRight: {
    left: 36,
    top: 18,
    transform: [{ rotate: '42deg' }],
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
});
