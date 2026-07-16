import { StyleSheet, View } from 'react-native';

type SoilPileProps = {
  x: number;
  y: number;
  index?: number;
};

export function SoilPile({ x, y, index = 0 }: SoilPileProps) {
  const tilt = index % 2 === 0 ? '-12deg' : '18deg';

  return (
    <View
      style={[
        styles.wrapper,
        {
          left: x - 18,
          top: y - 12,
          transform: [{ rotate: tilt }],
        },
      ]}>
      <View style={styles.clumpMain} />
      <View style={styles.clumpSide} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: 36,
    height: 24,
    zIndex: 0,
  },
  clumpMain: {
    position: 'absolute',
    width: 22,
    height: 14,
    left: 6,
    top: 6,
    backgroundColor: '#5D4037',
    borderWidth: 2,
    borderColor: '#3E2723',
    borderRadius: 8,
  },
  clumpSide: {
    position: 'absolute',
    width: 14,
    height: 10,
    left: 18,
    top: 10,
    backgroundColor: '#6D4C41',
    borderWidth: 1,
    borderColor: '#3E2723',
    borderRadius: 6,
  },
});
