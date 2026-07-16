import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export function TimmyFartCloud() {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fade.setValue(0);
    rise.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(fade, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.delay(1400),
        Animated.timing(fade, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rise, {
        toValue: 1,
        duration: 2100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise]);

  const translateY = rise.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  return (
    <Animated.View
      style={[styles.wrapper, { opacity: fade, transform: [{ translateY }] }]}
      pointerEvents="none">
      <View style={styles.cloudCluster}>
        <View style={[styles.puff, styles.puffMain]} />
        <View style={[styles.puff, styles.puffLeft]} />
        <View style={[styles.puff, styles.puffRight]} />
      </View>
      <Text style={styles.label}>*Pfrz*</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 18,
    top: 118,
    zIndex: 8,
    alignItems: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  cloudCluster: {
    width: 46,
    height: 34,
  },
  puff: {
    position: 'absolute',
    backgroundColor: 'rgba(124, 179, 66, 0.85)',
    borderWidth: 2,
    borderColor: 'rgba(51, 105, 30, 0.65)',
  },
  puffMain: {
    width: 24,
    height: 18,
    borderRadius: 10,
    left: 10,
    top: 10,
  },
  puffLeft: {
    width: 16,
    height: 14,
    borderRadius: 8,
    left: 0,
    top: 14,
    backgroundColor: 'rgba(158, 157, 36, 0.8)',
  },
  puffRight: {
    width: 14,
    height: 12,
    borderRadius: 7,
    left: 28,
    top: 12,
    backgroundColor: 'rgba(139, 195, 74, 0.82)',
  },
  label: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '900',
    color: '#33691E',
    fontFamily: 'Courier',
    transform: [{ rotate: '6deg' }],
  },
});
