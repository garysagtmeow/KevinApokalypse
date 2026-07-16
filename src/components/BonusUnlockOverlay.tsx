import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { GoldenStarfield } from './GoldenStarfield';
import { CHARACTER_VISUALS } from '@/src/entities/character-assets';

type BonusUnlockOverlayProps = {
  onStart: () => void;
};

const KEVIN_VISUAL = CHARACTER_VISUALS.kevin;

export function BonusUnlockOverlay({ onStart }: BonusUnlockOverlayProps) {
  const kevinFloat = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(kevinFloat, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(kevinFloat, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ]),
    );
    floatLoop.start();

    const titleSpring = Animated.spring(titleScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    });
    titleSpring.start();

    return () => {
      floatLoop.stop();
      titleSpring.stop();
    };
  }, [kevinFloat, titleScale]);

  const floatY = kevinFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  return (
    <View style={styles.overlay}>
      <GoldenStarfield />
      <Animated.View style={[styles.content, { transform: [{ scale: titleScale }] }]}>
        <Animated.View style={[styles.kevinWrap, { transform: [{ translateY: floatY }] }]}>
          <Image source={KEVIN_VISUAL.head} style={styles.kevinHead} contentFit="contain" />
          <Image source={KEVIN_VISUAL.body} style={styles.kevinBody} contentFit="contain" />
        </Animated.View>

        <Text style={styles.unlockTitle}>BONUSLEVEL FREIGESCHALTET!</Text>
        <Text style={styles.unlockHint}>Kevin riecht Chancen…</Text>

        <Pressable
          onPress={onStart}
          style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}>
          <Text style={styles.startButtonText}>Bonuslevel starten!</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 193, 7, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 110,
    elevation: 110,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  kevinWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  kevinHead: {
    width: KEVIN_VISUAL.headSize + 20,
    height: KEVIN_VISUAL.headSize + 20,
    zIndex: 2,
  },
  kevinBody: {
    width: KEVIN_VISUAL.bodyWidth + 10,
    height: KEVIN_VISUAL.bodyHeight + 10,
    marginTop: KEVIN_VISUAL.bodyOffsetY,
    zIndex: 1,
  },
  unlockTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#5D4037',
    fontFamily: 'Courier',
    textAlign: 'center',
    letterSpacing: 1,
    transform: [{ rotate: '-2deg' }],
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  unlockHint: {
    marginTop: 10,
    fontSize: 16,
    color: '#6D4C41',
    fontFamily: 'Courier',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  startButton: {
    marginTop: 28,
    backgroundColor: '#FFD54F',
    borderWidth: 4,
    borderColor: '#E6A800',
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 18,
    transform: [{ rotate: '2deg' }],
    shadowColor: '#F57F17',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  startButtonPressed: {
    transform: [{ rotate: '2deg' }, { scale: 0.96 }],
  },
  startButtonText: {
    color: '#5D4037',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'Courier',
    letterSpacing: 0.5,
  },
});
