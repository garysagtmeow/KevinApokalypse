import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const STAR_COUNT = 28;

type StarConfig = {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
};

function createStars(): StarConfig[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 4 + Math.random() * 8,
    delay: Math.random() * 1200,
    duration: 900 + Math.random() * 900,
  }));
}

function Star({ config }: { config: StarConfig }) {
  const opacity = useRef(new Animated.Value(0.2)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: config.duration / 2, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.2, duration: config.duration / 2, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.15, duration: config.duration / 2, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.75, duration: config.duration / 2, useNativeDriver: true }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [config.delay, config.duration, opacity, scale]);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: `${config.left}%`,
          top: `${config.top}%`,
          width: config.size,
          height: config.size,
          opacity,
          transform: [{ scale }, { rotate: '45deg' }],
        },
      ]}
    />
  );
}

export function GoldenStarfield() {
  const stars = useMemo(() => createStars(), []);
  const { width, height } = Dimensions.get('window');

  return (
    <View style={[styles.container, { width, height }]} pointerEvents="none">
      {stars.map((config, index) => (
        <Star key={index} config={config} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFD600',
    borderRadius: 1,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
});
