import { StyleSheet, View } from 'react-native';

type TimmySteakPlateProps = {
  visible?: boolean;
};

export function TimmySteakPlate({ visible = true }: TimmySteakPlateProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.plate}>
        <View style={styles.plateRim} />
        <View style={styles.steakShell}>
          <View style={styles.steakBody}>
            <View style={styles.steakCap} />
            <View style={styles.fatMarbling} />
            <View style={styles.fatMarblingSmall} />
            <View style={[styles.grillMark, styles.grillMarkOne]} />
            <View style={[styles.grillMark, styles.grillMarkTwo]} />
            <View style={[styles.grillMark, styles.grillMarkThree]} />
            <View style={styles.searEdge} />
          </View>
          <View style={styles.steakTip} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 32,
    top: 84,
    zIndex: 8,
    transform: [{ rotate: '-4deg' }],
  },
  plate: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFF8E1',
    borderWidth: 3,
    borderColor: '#3D2914',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3D2914',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
  },
  plateRim: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(61, 41, 20, 0.25)',
  },
  steakShell: {
    width: 44,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '8deg' }],
  },
  steakBody: {
    position: 'absolute',
    left: 0,
    top: 2,
    width: 40,
    height: 28,
    backgroundColor: '#7B3F2B',
    borderWidth: 2.5,
    borderColor: '#3D2914',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 6,
    overflow: 'hidden',
  },
  steakCap: {
    position: 'absolute',
    right: -2,
    top: 4,
    width: 14,
    height: 20,
    backgroundColor: '#F2D4A2',
    borderWidth: 2,
    borderColor: '#3D2914',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 3,
    transform: [{ rotate: '6deg' }],
  },
  steakTip: {
    position: 'absolute',
    left: 2,
    bottom: 0,
    width: 12,
    height: 10,
    backgroundColor: '#7B3F2B',
    borderWidth: 2.5,
    borderColor: '#3D2914',
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 2,
    borderBottomRightRadius: 4,
    transform: [{ rotate: '-18deg' }],
  },
  fatMarbling: {
    position: 'absolute',
    left: 10,
    top: 9,
    width: 16,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 228, 196, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(61, 41, 20, 0.35)',
    transform: [{ rotate: '-8deg' }],
  },
  fatMarblingSmall: {
    position: 'absolute',
    left: 18,
    top: 16,
    width: 8,
    height: 4,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 235, 205, 0.8)',
    transform: [{ rotate: '12deg' }],
  },
  grillMark: {
    position: 'absolute',
    height: 2.5,
    backgroundColor: '#4E2A1E',
    borderRadius: 1,
  },
  grillMarkOne: {
    left: 6,
    top: 7,
    width: 22,
    transform: [{ rotate: '-22deg' }],
  },
  grillMarkTwo: {
    left: 8,
    top: 13,
    width: 20,
    transform: [{ rotate: '-22deg' }],
  },
  grillMarkThree: {
    left: 10,
    top: 19,
    width: 16,
    transform: [{ rotate: '-22deg' }],
  },
  searEdge: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 10,
    height: 22,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 4,
    backgroundColor: 'rgba(62, 39, 35, 0.35)',
  },
});
