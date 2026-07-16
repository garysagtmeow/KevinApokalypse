import { StyleSheet, View } from 'react-native';

type LivingRoomPlantProps = {
  x: number;
  y: number;
  knocked: boolean;
  variant?: 0 | 1 | 2;
};

export function LivingRoomPlant({ x, y, knocked, variant = 0 }: LivingRoomPlantProps) {
  const potColors = ['#B5651D', '#9C6B2E', '#A0522D'];
  const frondTilt = variant === 0 ? '4deg' : variant === 1 ? '-6deg' : '8deg';
  const knockDirection = variant === 1 ? -90 : 90;

  if (knocked) {
    return (
      <View
        style={[
          styles.plantKnockedWrapper,
          {
            left: x - 18,
            top: y - 34,
          },
        ]}>
        <View
          style={[
            styles.plant,
            styles.plantKnocked,
            {
              transform: [
                { translateY: 34 },
                { rotate: `${knockDirection}deg` },
                { translateY: -34 },
              ],
            },
          ]}>
          <View style={[styles.part, styles.pot, { backgroundColor: potColors[variant] }]} />
          <View style={[styles.part, styles.potRim]} />
          <View style={[styles.part, styles.soil]} />
          <View style={[styles.part, styles.stem]} />
          <View style={[styles.part, styles.frond, styles.frondLeft]} />
          <View style={[styles.part, styles.frond, styles.frondCenter]} />
          <View style={[styles.part, styles.frond, styles.frondRight]} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.plant,
        styles.plantStanding,
        {
          left: x - 26,
          top: y - 58,
          transform: [{ rotate: frondTilt }],
        },
      ]}>
      <View style={[styles.part, styles.pot, { backgroundColor: potColors[variant] }]} />
      <View style={[styles.part, styles.potRim]} />
      <View style={[styles.part, styles.soil]} />
      <View style={[styles.part, styles.stem]} />
      <View style={[styles.part, styles.frond, styles.frondLeft]} />
      <View style={[styles.part, styles.frond, styles.frondCenter]} />
      <View style={[styles.part, styles.frond, styles.frondRight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  plantKnockedWrapper: {
    position: 'absolute',
    width: 118,
    height: 68,
    zIndex: 1,
  },
  plant: {
    position: 'absolute',
    width: 52,
    height: 118,
  },
  plantStanding: {
    zIndex: 2,
  },
  plantKnocked: {
    zIndex: 1,
  },
  part: {
    position: 'absolute',
  },
  pot: {
    width: 34,
    height: 28,
    left: 8,
    top: 88,
    borderWidth: 2,
    borderColor: '#5D3A1A',
    borderRadius: 4,
  },
  potRim: {
    width: 38,
    height: 7,
    left: 6,
    top: 84,
    backgroundColor: '#8B4513',
    borderWidth: 2,
    borderColor: '#3D2914',
    borderRadius: 2,
  },
  soil: {
    width: 28,
    height: 5,
    left: 11,
    top: 88,
    backgroundColor: '#4E342E',
    borderRadius: 2,
  },
  stem: {
    width: 5,
    height: 52,
    left: 23,
    top: 38,
    backgroundColor: '#6D8B3D',
    borderWidth: 2,
    borderColor: '#33691E',
    borderRadius: 2,
  },
  frond: {
    width: 9,
    height: 34,
    backgroundColor: '#7CB342',
    borderWidth: 2,
    borderColor: '#33691E',
    borderRadius: 5,
    top: 8,
    left: 21,
  },
  frondLeft: {
    transform: [{ rotate: '-52deg' }],
    height: 30,
  },
  frondCenter: {
    transform: [{ rotate: '2deg' }],
    height: 40,
    left: 22,
    top: 0,
  },
  frondRight: {
    transform: [{ rotate: '58deg' }],
    height: 28,
    left: 26,
    top: 12,
  },
});
