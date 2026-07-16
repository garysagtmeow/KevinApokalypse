import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

type BonusLevelButtonProps = {
  onPress: () => void;
};

const SPARKLE_POSITIONS = [
  { top: 6, left: 10 },
  { top: 22, left: 28 },
  { top: 8, right: 14 },
  { top: 26, right: 36 },
];

function SparkleDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.15, duration: 520, useNativeDriver: true }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [delay, opacity]);

  return <Animated.View style={[styles.sparkle, { opacity }]} />;
}

export function BonusLevelButton({ onPress }: BonusLevelButtonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shimmer, { toValue: 1, duration: 1600, useNativeDriver: true }),
          Animated.timing(shimmer, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(glow, { toValue: 1.05, duration: 800, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [glow, shimmer]);

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-72, 160],
  });

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Animated.View style={[styles.button, { transform: [{ scale: glow }] }]}>
        <Animated.View
          style={[styles.shimmer, { transform: [{ translateX: shimmerTranslate }, { skewX: '-18deg' }] }]}
        />
        {SPARKLE_POSITIONS.map((position, index) => (
          <View key={index} style={[styles.sparkleAnchor, position]}>
            <SparkleDot delay={index * 180} />
          </View>
        ))}
        <Text style={styles.label}>Bonus-Level!</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 3,
    borderColor: '#E6A800',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFD54F',
    overflow: 'hidden',
    transform: [{ rotate: '2deg' }],
    shadowColor: '#F9A825',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 10,
    elevation: 8,
  },
  shimmer: {
    position: 'absolute',
    top: -8,
    bottom: -8,
    width: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  sparkleAnchor: {
    position: 'absolute',
  },
  sparkle: {
    width: 5,
    height: 5,
    borderRadius: 2,
    backgroundColor: '#FFFDE7',
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  label: {
    color: '#5D4037',
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Courier',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
});
