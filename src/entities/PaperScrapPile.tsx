import { StyleSheet, View } from 'react-native';

type PaperScrapPileProps = {
  x: number;
  y: number;
  index?: number;
};

export function PaperScrapPile({ x, y, index = 0 }: PaperScrapPileProps) {
  const tilt = index % 2 === 0 ? '-16deg' : '22deg';

  return (
    <View
      style={[
        styles.wrapper,
        {
          left: x - 16,
          top: y - 10,
          transform: [{ rotate: tilt }],
        },
      ]}>
      <View style={styles.scrapMain} />
      <View style={styles.scrapSide} />
      <View style={styles.scrapCorner} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: 32,
    height: 22,
    zIndex: 0,
  },
  scrapMain: {
    position: 'absolute',
    width: 18,
    height: 14,
    left: 6,
    top: 4,
    backgroundColor: '#FFF8E1',
    borderWidth: 2,
    borderColor: '#3D2914',
    borderRadius: 2,
  },
  scrapSide: {
    position: 'absolute',
    width: 12,
    height: 10,
    left: 16,
    top: 8,
    backgroundColor: '#FFECB3',
    borderWidth: 1.5,
    borderColor: '#3D2914',
    borderRadius: 2,
    transform: [{ rotate: '18deg' }],
  },
  scrapCorner: {
    position: 'absolute',
    width: 6,
    height: 6,
    left: 10,
    top: 2,
    backgroundColor: '#FFFDE7',
    borderWidth: 1,
    borderColor: '#3D2914',
    transform: [{ rotate: '-24deg' }],
  },
});
