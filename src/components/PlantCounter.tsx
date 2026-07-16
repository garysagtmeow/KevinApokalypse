import { StyleSheet, Text, View } from 'react-native';

type PlantCounterProps = {
  rescued: number;
  total: number;
};

export function PlantCounter({ rescued, total }: PlantCounterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pflanzen gerettet</Text>
      <View style={styles.row}>
        {Array.from({ length: total }, (_, index) => (
          <View
            key={index}
            style={[
              styles.slot,
              index < rescued ? styles.slotSaved : styles.slotKnocked,
            ]}>
            <Text style={styles.icon}>{index < rescued ? '✓' : '🌱'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginTop: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3D2914',
    fontFamily: 'Courier',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
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
  slotKnocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  icon: {
    fontSize: 11,
  },
});
