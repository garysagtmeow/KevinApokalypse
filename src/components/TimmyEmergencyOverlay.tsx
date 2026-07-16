import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

type TimmyEmergencyOverlayProps = {
  active: boolean;
};

export function TimmyEmergencyOverlay({ active }: TimmyEmergencyOverlayProps) {
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      blink.setValue(1);
      return undefined;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 0.25,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [active, blink]);

  if (!active) {
    return null;
  }

  return (
    <Animated.View style={[styles.warningSymbol, { opacity: blink }]}>
      <View style={styles.warningInner}>
        <View style={styles.warningDot} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  warningSymbol: {
    position: 'absolute',
    top: -18,
    left: 48,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D32F2F',
    borderWidth: 3,
    borderColor: '#7F0000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 8,
    transform: [{ rotate: '8deg' }],
  },
  warningInner: {
    width: 4,
    height: 14,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  warningDot: {
    position: 'absolute',
    bottom: -1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFF',
  },
});
