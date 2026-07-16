import { useEffect, useRef } from 'react';
import { Animated, Image, Platform, StyleSheet, Text, View } from 'react-native';

import { HoldPressable } from '@/src/components/HoldPressable';

type TimmyRescueButtonProps = {
  onHoldStart: () => void;
  onHoldEnd: () => void;
  active: boolean;
  holdProgress: number;
  showHoldProgress: boolean;
};

function getWebLabelUri(active: boolean): string {
  const titleFill = active ? '#FFEB3B' : '#FFFFFF';
  const hintFill = active ? '#FFFFFF' : 'rgba(255,255,255,0.95)';

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="78" height="30" role="img" aria-label="Timmy retten, 2 Sekunden gedrückt halten">
  <text x="39" y="12" text-anchor="middle" fill="${titleFill}" font-family="Courier, monospace" font-size="10" font-weight="900">Timmy</text>
  <text x="39" y="24" text-anchor="middle" fill="${hintFill}" font-family="Courier, monospace" font-size="7" font-weight="800">2s halten</text>
</svg>`)}`;
}

function WebTimmyLabel({ active }: { active: boolean }) {
  return (
    <Image
      source={{ uri: getWebLabelUri(active) }}
      style={styles.webLabel}
      accessible
      accessibilityLabel="Timmy retten, 2 Sekunden gedrückt halten"
    />
  );
}

export function TimmyRescueButton({
  onHoldStart,
  onHoldEnd,
  active,
  holdProgress,
  showHoldProgress,
}: TimmyRescueButtonProps) {
  const pulse = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.65)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: active ? 1.12 : 1.08,
            duration: active ? 380 : 520,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: active ? 380 : 520,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(glow, {
            toValue: 1,
            duration: active ? 380 : 520,
            useNativeDriver: true,
          }),
          Animated.timing(glow, {
            toValue: active ? 0.72 : 0.55,
            duration: active ? 380 : 520,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [active, glow, pulse]);

  return (
    <Animated.View
      style={[
        styles.pulseWrapper,
        {
          opacity: glow,
          transform: [{ rotate: '-4deg' }, { scale: pulse }],
        },
      ]}>
      <HoldPressable
        onHoldStart={onHoldStart}
        onHoldEnd={onHoldEnd}
        disabled={!active}
        style={[
          styles.button,
          active ? styles.buttonActive : styles.buttonWaiting,
        ]}>
        {showHoldProgress && (
          <View style={styles.progressRing} pointerEvents="none">
            <View
              style={[
                styles.progressFill,
                { height: `${Math.round(holdProgress * 100)}%` },
              ]}
            />
          </View>
        )}
        {Platform.OS === 'web' ? (
          <WebTimmyLabel active={active} />
        ) : (
          <>
            <Text selectable={false} style={[styles.label, active && styles.labelActive]}>
              Timmy retten
            </Text>
            <Text selectable={false} style={[styles.hint, active && styles.hintActive]}>
              (2s gedrückt halten)
            </Text>
          </>
        )}
      </HoldPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pulseWrapper: {
    marginRight: 10,
  },
  button: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 3,
    overflow: 'hidden',
    shadowColor: '#B71C1C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonWaiting: {
    backgroundColor: '#FF6D00',
    borderColor: '#FFAB00',
  },
  buttonActive: {
    backgroundColor: '#FF1744',
    borderColor: '#FFEB3B',
    shadowColor: '#FF1744',
    shadowRadius: 14,
  },
  progressRing: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  progressFill: {
    width: '100%',
    backgroundColor: 'rgba(255, 235, 59, 0.55)',
  },
  webLabel: {
    width: 78,
    height: 30,
    zIndex: 1,
    pointerEvents: 'none',
  },
  label: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Courier',
    textAlign: 'center',
    lineHeight: 13,
    zIndex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  labelActive: {
    color: '#FFEB3B',
  },
  hint: {
    marginTop: 2,
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 7,
    fontWeight: '800',
    fontFamily: 'Courier',
    textAlign: 'center',
    lineHeight: 9,
    zIndex: 1,
  },
  hintActive: {
    color: '#FFF',
  },
});
