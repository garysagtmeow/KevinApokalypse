import { useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

import type { Vector2 } from '@/src/systems/movement';

const JOYSTICK_SIZE = 88;
const KNOB_SIZE = 34;
const MAX_RADIUS = (JOYSTICK_SIZE - KNOB_SIZE) / 2;

type VirtualJoystickProps = {
  onDirectionChange: (direction: Vector2) => void;
};

export function VirtualJoystick({ onDirectionChange }: VirtualJoystickProps) {
  const [knobOffset, setKnobOffset] = useState<Vector2>({ x: 0, y: 0 });
  const onDirectionChangeRef = useRef(onDirectionChange);
  onDirectionChangeRef.current = onDirectionChange;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const distance = Math.hypot(gesture.dx, gesture.dy);
        const clampedDistance = Math.min(distance, MAX_RADIUS);
        const angle = Math.atan2(gesture.dy, gesture.dx);
        const x = Math.cos(angle) * clampedDistance;
        const y = Math.sin(angle) * clampedDistance;

        setKnobOffset({ x, y });
        onDirectionChangeRef.current({
          x: x / MAX_RADIUS,
          y: y / MAX_RADIUS,
        });
      },
      onPanResponderRelease: () => {
        setKnobOffset({ x: 0, y: 0 });
        onDirectionChangeRef.current({ x: 0, y: 0 });
      },
      onPanResponderTerminate: () => {
        setKnobOffset({ x: 0, y: 0 });
        onDirectionChangeRef.current({ x: 0, y: 0 });
      },
    }),
  ).current;

  return (
    <View style={styles.base} {...panResponder.panHandlers}>
      <View
        style={[
          styles.knob,
          {
            transform: [{ translateX: knobOffset.x }, { translateY: knobOffset.y }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: JOYSTICK_SIZE,
    height: JOYSTICK_SIZE,
    borderRadius: JOYSTICK_SIZE / 2,
    backgroundColor: 'rgba(60, 60, 60, 0.25)',
    borderWidth: 3,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '-4deg' }],
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: '#888',
    borderWidth: 2,
    borderColor: '#333',
  },
});
