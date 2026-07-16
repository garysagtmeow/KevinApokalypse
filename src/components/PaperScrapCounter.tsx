import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

const COLUMNS = 5;
const GRID_GAP = 4;

type MiniScrapIconProps = {
  recycled: boolean;
  index: number;
  slotSize: number;
};

function MiniScrapIcon({ recycled, index, slotSize }: MiniScrapIconProps) {
  const tilt = (index % COLUMNS) * 6 - 12;
  const scale = slotSize / 16;

  if (recycled) {
    return (
      <View
        style={[
          styles.slot,
          styles.slotRecycled,
          {
            width: slotSize,
            height: slotSize,
            transform: [{ rotate: `${tilt}deg` }],
          },
        ]}>
        <Text style={[styles.recycledMark, { fontSize: 9 * scale }]}>✓</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.slot,
        {
          width: slotSize,
          height: slotSize,
          transform: [{ rotate: `${tilt}deg` }],
        },
      ]}>
      <View
        style={[
          styles.scrap,
          {
            width: 10 * scale,
            height: 8 * scale,
            borderRadius: 2 * scale,
          },
        ]}
      />
    </View>
  );
}

type PaperScrapCounterProps = {
  recycled: number;
  total: number;
};

export function PaperScrapCounter({ recycled, total }: PaperScrapCounterProps) {
  const [labelWidth, setLabelWidth] = useState(0);

  const slotSize =
    labelWidth > 0 ? (labelWidth - GRID_GAP * (COLUMNS - 1)) / COLUMNS : 16;

  const handleLabelLayout = (event: LayoutChangeEvent) => {
    setLabelWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label} onLayout={handleLabelLayout}>
        Altpapier
      </Text>
      {labelWidth > 0 && (
        <View style={[styles.grid, { width: labelWidth, gap: GRID_GAP }]}>
          {Array.from({ length: total }, (_, index) => (
            <MiniScrapIcon
              key={index}
              index={index}
              recycled={index < recycled}
              slotSize={slotSize}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginTop: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3D2914',
    fontFamily: 'Courier',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotRecycled: {
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.45)',
    borderStyle: 'dashed',
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  recycledMark: {
    fontWeight: '900',
    color: '#2E7D32',
    fontFamily: 'Courier',
    lineHeight: 12,
  },
  scrap: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#3D2914',
    transform: [{ rotate: '14deg' }],
  },
});
