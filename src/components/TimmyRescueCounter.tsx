import { StyleSheet, Text, View } from 'react-native';

type TimmyRescueCounterProps = {
  rescued: boolean;
};

export function TimmyRescueCounter({ rescued }: TimmyRescueCounterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Timmy gerettet</Text>
      <View style={[styles.slot, rescued ? styles.slotSaved : styles.slotPending]}>
        <Text style={styles.icon}>{rescued ? '✓' : '🥩'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3D2914',
    fontFamily: 'Courier',
    marginBottom: 4,
  },
  slot: {
    width: 22,
    height: 22,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3D2914',
  },
  slotSaved: {
    backgroundColor: 'rgba(129, 199, 132, 0.55)',
  },
  slotPending: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  icon: {
    fontSize: 11,
  },
});
