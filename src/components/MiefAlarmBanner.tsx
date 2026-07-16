import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

function StinkHazardIcon({ flip = false }: { flip?: boolean }) {
  return (
    <View
      style={[
        styles.iconWrap,
        flip && styles.iconFlip,
      ]}>
      <View style={styles.triangleShadow} />
      <View style={styles.triangle} />
      <View style={styles.skull}>
        <View style={styles.skullEyeRow}>
          <Text style={styles.skullEye}>x</Text>
          <Text style={styles.skullEye}>x</Text>
        </View>
        <View style={styles.skullMouth} />
      </View>
      <View style={[styles.gasWisp, styles.gasWispLeft]} />
      <View style={[styles.gasWisp, styles.gasWispCenter]} />
      <View style={[styles.gasWisp, styles.gasWispRight]} />
    </View>
  );
}

export function MiefAlarmBanner() {
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 0.15,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [blink]);

  return (
    <Animated.View style={[styles.banner, { opacity: blink }]}>
      <StinkHazardIcon />
      <Text style={styles.text}>MIEF-ALARM</Text>
      <StinkHazardIcon flip />
    </Animated.View>
  );
}

const TRIANGLE_SIZE = 26;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 4,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#D50000',
    borderWidth: 3,
    borderColor: '#FF1744',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    transform: [{ rotate: '-2deg' }],
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  text: {
    color: '#FFEB3B',
    fontWeight: '900',
    fontSize: 22,
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
  iconWrap: {
    width: 34,
    height: 38,
    alignItems: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  iconFlip: {
    transform: [{ rotate: '10deg' }, { scaleX: -1 }],
  },
  triangleShadow: {
    position: 'absolute',
    top: 2,
    width: 0,
    height: 0,
    borderLeftWidth: TRIANGLE_SIZE / 2 + 2,
    borderRightWidth: TRIANGLE_SIZE / 2 + 2,
    borderBottomWidth: TRIANGLE_SIZE + 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#3D2914',
  },
  triangle: {
    position: 'absolute',
    top: 0,
    width: 0,
    height: 0,
    borderLeftWidth: TRIANGLE_SIZE / 2,
    borderRightWidth: TRIANGLE_SIZE / 2,
    borderBottomWidth: TRIANGLE_SIZE,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFD600',
  },
  skull: {
    position: 'absolute',
    top: 9,
    alignItems: 'center',
  },
  skullEyeRow: {
    flexDirection: 'row',
    gap: 4,
  },
  skullEye: {
    fontSize: 8,
    fontWeight: '900',
    color: '#3D2914',
    fontFamily: 'Courier',
    lineHeight: 8,
  },
  skullMouth: {
    width: 10,
    height: 2,
    marginTop: 1,
    backgroundColor: '#3D2914',
    transform: [{ rotate: '8deg' }],
  },
  gasWisp: {
    position: 'absolute',
    bottom: 0,
    width: 8,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#7CB342',
    borderWidth: 1,
    borderColor: '#33691E',
  },
  gasWispLeft: {
    left: 2,
    transform: [{ rotate: '-20deg' }],
  },
  gasWispCenter: {
    bottom: -2,
    width: 10,
    backgroundColor: '#9E9D24',
    transform: [{ rotate: '5deg' }],
  },
  gasWispRight: {
    right: 2,
    transform: [{ rotate: '18deg' }],
  },
});
