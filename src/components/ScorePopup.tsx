import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

type ScorePopupProps = {
  text: string;
  x: number;
  y: number;
  onDone: () => void;
};

export function ScorePopup({ text, x, y, onDone }: ScorePopupProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    });

    animation.start(({ finished }) => {
      if (finished) {
        onDone();
      }
    });

    return () => animation.stop();
  }, [onDone, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -36],
  });

  const opacity = progress.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Animated.Text
      style={[
        styles.popup,
        {
          left: x - 24,
          top: y - 48,
          opacity,
          transform: [{ translateY }],
        },
      ]}>
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    fontSize: 22,
    fontWeight: '900',
    color: '#FFD600',
    fontFamily: 'Courier',
    zIndex: 50,
    textShadowColor: '#5D4037',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
