import { StyleSheet, View } from 'react-native';

type CardboardBoxProps = {
  x: number;
  y: number;
  knocked: boolean;
  variant?: 0 | 1 | 2;
};

export function CardboardBox({ x, y, knocked, variant = 0 }: CardboardBoxProps) {
  if (knocked) {
    return null;
  }

  const tapeTilt = variant === 0 ? '-8deg' : variant === 1 ? '6deg' : '-14deg';

  return (
    <View
      style={[
        styles.box,
        {
          left: x - 28,
          top: y - 44,
          transform: [{ rotate: tapeTilt }],
        },
      ]}>
      <View style={styles.lid} />
      <View style={styles.body} />
      <View style={styles.tape} />
      <View style={styles.sideFold} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    width: 56,
    height: 44,
    zIndex: 2,
  },
  body: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 56,
    height: 36,
    backgroundColor: '#C4A574',
    borderWidth: 2.5,
    borderColor: '#3D2914',
    borderRadius: 3,
  },
  lid: {
    position: 'absolute',
    left: 2,
    top: 0,
    width: 52,
    height: 12,
    backgroundColor: '#D4B896',
    borderWidth: 2.5,
    borderColor: '#3D2914',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tape: {
    position: 'absolute',
    left: 22,
    top: 8,
    width: 12,
    height: 30,
    backgroundColor: 'rgba(255, 248, 220, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(61, 41, 20, 0.35)',
    borderRadius: 1,
  },
  sideFold: {
    position: 'absolute',
    right: 4,
    bottom: 6,
    width: 10,
    height: 24,
    borderRightWidth: 2,
    borderColor: 'rgba(61, 41, 20, 0.25)',
  },
});
