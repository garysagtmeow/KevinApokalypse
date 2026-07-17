import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text } from 'react-native';

type CheeseWedgeProps = {
  x: number;
  y: number;
  kind: 'normal' | 'mega';
};

const NORMAL_SIZE = { width: 40, height: 36 };
const MEGA_SIZE = { width: 56, height: 52 };

const NORMAL_CHEESE_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="36" viewBox="0 0 40 36">
  <polygon points="20,2 36,34 4,34" fill="#FFC107"/>
  <polygon points="20,8 30,30 10,30" fill="#FFE082" opacity="0.45"/>
  <circle cx="20" cy="24" r="3" fill="#FFE082"/>
</svg>`)}`;

const MEGA_CHEESE_URI = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="52" viewBox="0 0 56 52">
  <defs>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#FFD600" flood-opacity="0.85"/>
    </filter>
  </defs>
  <polygon points="28,3 50,48 6,48" fill="#FFD54F" filter="url(#glow)"/>
  <polygon points="28,10 42,42 14,42" fill="#FFF176" opacity="0.4"/>
  <circle cx="28" cy="34" r="4" fill="#FFF59D"/>
</svg>`)}`;

export function CheeseWedge({ x, y, kind }: CheeseWedgeProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const isMega = kind === 'mega';
  const size = isMega ? MEGA_SIZE : NORMAL_SIZE;

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
          left: x - size.width / 2,
          top: y - size.height / 2,
          width: size.width,
          height: size.height,
          transform: isMega ? [{ scale: pulse }] : [{ rotate: '-8deg' }],
        },
      ]}>
      <Image
        source={{ uri: isMega ? MEGA_CHEESE_URI : NORMAL_CHEESE_URI }}
        style={styles.image}
        resizeMode="contain"
        accessible
        accessibilityLabel={isMega ? 'Mega-Käse' : 'Käse'}
      />
      {isMega && <Text style={styles.megaLabel}>MEGA-KÄSE</Text>}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    backgroundColor: 'transparent',
  },
  megaWrapper: {
    zIndex: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
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
