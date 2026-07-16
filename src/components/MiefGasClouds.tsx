import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type CloudConfig = {
  left: `${number}%`;
  top: `${number}%`;
  scale: number;
  delay: number;
};

const CLOUDS: CloudConfig[] = [
  { left: '4%', top: '55%', scale: 1.1, delay: 0 },
  { left: '12%', top: '72%', scale: 0.9, delay: 200 },
  { left: '28%', top: '82%', scale: 1.2, delay: 400 },
  { left: '48%', top: '78%', scale: 1, delay: 100 },
  { left: '62%', top: '85%', scale: 1.15, delay: 300 },
  { left: '78%', top: '70%', scale: 0.95, delay: 500 },
  { left: '88%', top: '52%', scale: 1.05, delay: 150 },
  { left: '6%', top: '35%', scale: 0.85, delay: 350 },
  { left: '90%', top: '38%', scale: 0.8, delay: 250 },
  { left: '42%', top: '58%', scale: 0.75, delay: 450 },
];

function GasCloud({ config }: { config: CloudConfig }) {
  const drift = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(drift, {
            toValue: 1,
            duration: 2200,
            delay: config.delay,
            useNativeDriver: true,
          }),
          Animated.timing(drift, {
            toValue: 0,
            duration: 2200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(fade, {
            toValue: 0.65,
            duration: 1400,
            delay: config.delay,
            useNativeDriver: true,
          }),
          Animated.timing(fade, {
            toValue: 0.3,
            duration: 1400,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [config.delay, drift, fade]);

  const translateY = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });

  const translateX = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 6, -4],
  });

  const scale = config.scale;

  return (
    <Animated.View
      style={[
        styles.cloudCluster,
        {
          left: config.left,
          top: config.top,
          opacity: fade,
          transform: [{ translateY }, { translateX }, { scale }],
        },
      ]}>
      <View style={[styles.puff, styles.puffMain]} />
      <View style={[styles.puff, styles.puffLeft]} />
      <View style={[styles.puff, styles.puffRight]} />
      <View style={[styles.puff, styles.puffTop]} />
    </Animated.View>
  );
}

export function MiefGasClouds() {
  return (
    <View style={styles.container} pointerEvents="none">
      {CLOUDS.map((config, index) => (
        <GasCloud key={index} config={config} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  cloudCluster: {
    position: 'absolute',
    width: 72,
    height: 52,
  },
  puff: {
    position: 'absolute',
    backgroundColor: 'rgba(124, 179, 66, 0.75)',
    borderWidth: 2,
    borderColor: 'rgba(51, 105, 30, 0.6)',
  },
  puffMain: {
    width: 38,
    height: 28,
    borderRadius: 16,
    left: 16,
    top: 14,
  },
  puffLeft: {
    width: 26,
    height: 22,
    borderRadius: 13,
    left: 2,
    top: 20,
    backgroundColor: 'rgba(158, 157, 36, 0.7)',
  },
  puffRight: {
    width: 24,
    height: 20,
    borderRadius: 12,
    left: 44,
    top: 18,
    backgroundColor: 'rgba(139, 195, 74, 0.72)',
  },
  puffTop: {
    width: 22,
    height: 18,
    borderRadius: 11,
    left: 24,
    top: 2,
    backgroundColor: 'rgba(104, 159, 56, 0.68)',
  },
});
