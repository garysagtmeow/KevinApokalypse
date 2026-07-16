import { StyleSheet, View } from 'react-native';

type PoopPileProps = {
  x: number;
  y: number;
};

function HappyPoopFace() {
  return (
    <View style={styles.face}>
      <View style={styles.eyeRow}>
        <View style={styles.eye} />
        <View style={styles.eye} />
      </View>
      <View style={styles.smile} />
      <View style={[styles.cheek, styles.cheekLeft]} />
      <View style={[styles.cheek, styles.cheekRight]} />
    </View>
  );
}

export function PoopPile({ x, y }: PoopPileProps) {
  return (
    <View
      style={[
        styles.wrapper,
        {
          left: x - POOP_SIZE / 2,
          top: y - POOP_SIZE / 2,
        },
      ]}>
      <View style={[styles.chunk, styles.chunkBack]} />
      <View style={[styles.chunk, styles.chunkFront]} />
      <HappyPoopFace />
    </View>
  );
}

const POOP_SIZE = 36;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: POOP_SIZE,
    height: POOP_SIZE,
    transform: [{ rotate: '12deg' }],
  },
  chunk: {
    position: 'absolute',
    backgroundColor: '#6B4226',
    borderWidth: 2,
    borderColor: '#3D2914',
  },
  chunkBack: {
    width: 22,
    height: 16,
    borderRadius: 10,
    left: 2,
    top: 14,
    transform: [{ rotate: '-8deg' }],
  },
  chunkFront: {
    width: 18,
    height: 14,
    borderRadius: 8,
    left: 12,
    top: 6,
    transform: [{ rotate: '15deg' }],
  },
  face: {
    position: 'absolute',
    left: 14,
    top: 8,
    width: 16,
    height: 12,
    transform: [{ rotate: '-4deg' }],
  },
  eyeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  eye: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#2C1810',
  },
  smile: {
    alignSelf: 'center',
    width: 10,
    height: 5,
    marginTop: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#2C1810',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  cheek: {
    position: 'absolute',
    width: 4,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E8927C',
    top: 6,
  },
  cheekLeft: {
    left: 0,
    transform: [{ rotate: '-10deg' }],
  },
  cheekRight: {
    right: 0,
    transform: [{ rotate: '10deg' }],
  },
});
