import { StyleSheet, Text, View } from 'react-native';

import { KEVIN_KNAST_LAYOUT, getKevinKnastTop, type KevinKnastPlacement } from '@/src/systems/kevin-knast';
import type { Bounds } from '@/src/systems/movement';

type KevinKnastProps = {
  bounds: Bounds;
  placement?: KevinKnastPlacement;
};

export function KevinKnast({ bounds, placement }: KevinKnastProps) {
  const top = getKevinKnastTop(bounds, placement);

  return (
    <View
      style={[
        styles.knast,
        {
          top,
          left: KEVIN_KNAST_LAYOUT.left,
          width: KEVIN_KNAST_LAYOUT.width,
          height: KEVIN_KNAST_LAYOUT.height,
        },
      ]}>
      <View style={[styles.knastPart, styles.knastFloor]} />
      <View style={[styles.knastPart, styles.knastBackWall]} />
      <View style={[styles.knastPart, styles.knastRoof]} />
      <View style={[styles.knastPart, styles.knastSign]}>
        <Text style={styles.knastSignText}>KEVIN-KNAST</Text>
      </View>
      <View style={[styles.knastPart, styles.knastSideLeft]} />
      <View style={[styles.knastPart, styles.knastSideRight]} />
    </View>
  );
}

export function KevinKnastBars({ bounds, placement }: KevinKnastProps) {
  const top = getKevinKnastTop(bounds, placement);

  return (
    <View
      style={[
        styles.knastBars,
        {
          top,
          left: KEVIN_KNAST_LAYOUT.left,
          width: KEVIN_KNAST_LAYOUT.width,
          height: KEVIN_KNAST_LAYOUT.height,
        },
      ]}
      pointerEvents="none">
      <View style={[styles.knastPart, styles.bar, styles.bar1]} />
      <View style={[styles.knastPart, styles.bar, styles.bar2]} />
      <View style={[styles.knastPart, styles.bar, styles.bar3]} />
      <View style={[styles.knastPart, styles.bar, styles.bar4]} />
      <View style={[styles.knastPart, styles.bar, styles.bar5]} />
      <View style={[styles.knastPart, styles.bar, styles.bar6]} />
      <View style={[styles.knastPart, styles.barTop, styles.barTopLeft]} />
      <View style={[styles.knastPart, styles.barTop, styles.barTopRight]} />
      <View style={[styles.knastPart, styles.latch]} />
    </View>
  );
}

const styles = StyleSheet.create({
  knast: {
    position: 'absolute',
    transform: [{ rotate: '-3deg' }],
    zIndex: 1,
  },
  knastBars: {
    position: 'absolute',
    transform: [{ rotate: '-3deg' }],
    zIndex: 4,
  },
  knastPart: {
    position: 'absolute',
  },
  knastFloor: {
    width: 88,
    height: 10,
    left: 4,
    top: 112,
    backgroundColor: '#8B6914',
    borderWidth: 2,
    borderColor: '#3D2914',
    borderRadius: 3,
    transform: [{ rotate: '2deg' }],
  },
  knastBackWall: {
    width: 82,
    height: 78,
    left: 8,
    top: 38,
    backgroundColor: 'rgba(210, 190, 150, 0.55)',
    borderWidth: 2,
    borderColor: '#5D4037',
    borderRadius: 2,
    transform: [{ rotate: '-1deg' }],
  },
  knastRoof: {
    width: 94,
    height: 8,
    left: 2,
    top: 32,
    backgroundColor: '#6D4C41',
    borderWidth: 2,
    borderColor: '#3D2914',
    borderRadius: 2,
    transform: [{ rotate: '4deg' }],
  },
  knastSign: {
    left: 10,
    top: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    backgroundColor: '#FFF3D6',
    borderWidth: 2,
    borderColor: '#3D2914',
    transform: [{ rotate: '-7deg' }],
  },
  knastSignText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#B71C1C',
    fontFamily: 'Courier',
    letterSpacing: 0.3,
  },
  knastSideLeft: {
    width: 6,
    height: 82,
    left: 2,
    top: 34,
    backgroundColor: '#5D4037',
    borderWidth: 2,
    borderColor: '#3D2914',
    transform: [{ rotate: '-5deg' }],
  },
  knastSideRight: {
    width: 6,
    height: 80,
    left: 88,
    top: 36,
    backgroundColor: '#5D4037',
    borderWidth: 2,
    borderColor: '#3D2914',
    transform: [{ rotate: '6deg' }],
  },
  bar: {
    width: 4,
    height: 78,
    backgroundColor: '#757575',
    borderWidth: 1,
    borderColor: '#424242',
    borderRadius: 1,
    top: 36,
  },
  bar1: {
    left: 12,
    transform: [{ rotate: '-4deg' }],
    height: 74,
  },
  bar2: {
    left: 26,
    transform: [{ rotate: '2deg' }],
  },
  bar3: {
    left: 40,
    transform: [{ rotate: '-2deg' }],
    height: 80,
  },
  bar4: {
    left: 54,
    transform: [{ rotate: '3deg' }],
  },
  bar5: {
    left: 68,
    transform: [{ rotate: '-3deg' }],
    height: 76,
  },
  bar6: {
    left: 82,
    transform: [{ rotate: '5deg' }],
  },
  barTop: {
    width: 28,
    height: 4,
    backgroundColor: '#616161',
    borderWidth: 1,
    borderColor: '#424242',
    top: 34,
  },
  barTopLeft: {
    left: 10,
    transform: [{ rotate: '-8deg' }],
  },
  barTopRight: {
    left: 58,
    transform: [{ rotate: '7deg' }],
  },
  latch: {
    width: 8,
    height: 10,
    left: 78,
    top: 72,
    backgroundColor: '#FFC107',
    borderWidth: 2,
    borderColor: '#3D2914',
    borderRadius: 2,
    transform: [{ rotate: '12deg' }],
  },
});
