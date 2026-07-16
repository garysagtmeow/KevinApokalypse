import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const CONFETTI_COLORS = ['#FFD600', '#FF5252', '#69F0AE', '#448AFF', '#E040FB', '#FF9100'];
const PARTICLE_COUNT = 36;

type ParticleConfig = {
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
};

function createParticles(): ParticleConfig[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
    left: Math.random() * 100,
    size: 6 + Math.random() * 7,
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    delay: Math.random() * 800,
    duration: 1800 + Math.random() * 1200,
    drift: -40 + Math.random() * 80,
  }));
}

function ConfettiPiece({
  config,
  fallDistance,
}: {
  config: ParticleConfig;
  fallDistance: number;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(progress, {
          toValue: 1,
          duration: config.duration,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [config.delay, config.duration, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, fallDistance],
  });

  const translateX = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, config.drift, config.drift * 1.2],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.85, 1],
    outputRange: [1, 1, 0.3],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: `${config.left}%`,
          width: config.size,
          height: config.size * 0.6,
          backgroundColor: config.color,
          opacity,
          transform: [{ translateY }, { translateX }, { rotate }],
        },
      ]}
    />
  );
}

export function Confetti() {
  const particles = useMemo(() => createParticles(), []);
  const fallDistance = Dimensions.get('window').height;

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((config, index) => (
        <ConfettiPiece key={index} config={config} fallDistance={fallDistance} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    top: 0,
    borderRadius: 2,
  },
});
