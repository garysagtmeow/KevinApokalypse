import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type CheeseWedgeProps = {
  x: number;
  y: number;
  kind: 'normal' | 'mega';
};

export function CheeseWedge({ x, y, kind }: CheeseWedgeProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const isMega = kind === 'mega';

  useEffect(() => {
    if (!isMega) {
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 450, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [isMega, pulse]);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        isMega && styles.megaWrapper,
        {
          left: x - (isMega ? 28 : 20),
          top: y - (isMega ? 24 : 18),
          transform: isMega ? [{ scale: pulse }] : [{ rotate: '-8deg' }],
        },
      ]}>
      <View style={[styles.wedge, isMega && styles.megaWedge]} />
      <View style={[styles.wedgeHole, isMega && styles.megaHole]} />
      {isMega && <Text style={styles.megaLabel}>MEGA-KÄSE</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: 40,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  megaWrapper: {
    width: 56,
    height: 52,
    zIndex: 4,
  },
  wedge: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFC107',
    transform: [{ rotate: '18deg' }],
    shadowColor: '#F57F17',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  megaWedge: {
    borderLeftWidth: 22,
    borderRightWidth: 22,
    borderBottomWidth: 36,
    borderBottomColor: '#FFD54F',
    shadowColor: '#FFD600',
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  wedgeHole: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFE082',
    top: 14,
    left: 17,
  },
  megaHole: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF59D',
    top: 18,
    left: 24,
  },
  megaLabel: {
    position: 'absolute',
    bottom: -14,
    fontSize: 8,
    fontWeight: '900',
    color: '#E65100',
    fontFamily: 'Courier',
    letterSpacing: 0.3,
    textShadowColor: '#FFF',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
