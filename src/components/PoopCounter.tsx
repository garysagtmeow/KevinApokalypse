import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';

const COLUMNS = 5;
const GRID_GAP = 4;

type MiniPoopIconProps = {
  collected: boolean;
  index: number;
  slotSize: number;
};

function MiniPoopIcon({ collected, index, slotSize }: MiniPoopIconProps) {
  const tilt = (index % COLUMNS) * 7 - 14;
  const scale = slotSize / 16;

  if (collected) {
    return (
      <View
        style={[
          styles.slot,
          styles.slotCollected,
          {
            width: slotSize,
            height: slotSize,
            transform: [{ rotate: `${tilt}deg` }],
          },
        ]}>
        <Text style={[styles.collectedMark, { fontSize: 9 * scale }]}>x</Text>
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
          styles.chunk,
          styles.chunkBack,
          {
            width: 10 * scale,
            height: 7 * scale,
            borderRadius: 4 * scale,
            left: 1 * scale,
            top: 7 * scale,
          },
        ]}
      />
      <View
        style={[
          styles.chunk,
          styles.chunkFront,
          {
            width: 8 * scale,
            height: 6 * scale,
            borderRadius: 3 * scale,
            left: 6 * scale,
            top: 3 * scale,
          },
        ]}
      />
    </View>
  );
}

type PoopCounterProps = {
  collected: number;
  total: number;
};

export function PoopCounter({ collected, total }: PoopCounterProps) {
  const [labelWidth, setLabelWidth] = useState(0);

  const slotSize =
    labelWidth > 0 ? (labelWidth - GRID_GAP * (COLUMNS - 1)) / COLUMNS : 16;

  const handleLabelLayout = (event: LayoutChangeEvent) => {
    setLabelWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label} onLayout={handleLabelLayout}>
        Häufchen-Counter
      </Text>
      {labelWidth > 0 && (
        <View style={[styles.grid, { width: labelWidth, gap: GRID_GAP }]}>
          {Array.from({ length: total }, (_, index) => (
            <MiniPoopIcon
              key={index}
              index={index}
              collected={index < collected}
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
  slotCollected: {
    borderWidth: 1,
    borderColor: 'rgba(61, 41, 20, 0.35)',
    borderStyle: 'dashed',
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  collectedMark: {
    fontWeight: '900',
    color: 'rgba(61, 41, 20, 0.45)',
    fontFamily: 'Courier',
    lineHeight: 12,
  },
  chunk: {
    position: 'absolute',
    backgroundColor: '#6B4226',
    borderWidth: 1,
    borderColor: '#3D2914',
  },
  chunkBack: {
    transform: [{ rotate: '-8deg' }],
  },
  chunkFront: {
    transform: [{ rotate: '12deg' }],
  },
});
