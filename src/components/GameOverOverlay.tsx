import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { CHARACTER_HEADS } from '@/src/entities/character-assets';
import { endScreenCardStyles } from './end-screen-card';

type GameOverOverlayProps = {
  title: string;
  subtitle: string;
  onRestart: () => void;
};

const KEVIN_ZOOM_MS = 1500;
const CARD_DELAY_MS = 450;

export function GameOverOverlay({ title, subtitle, onRestart }: GameOverOverlayProps) {
  const [showCard, setShowCard] = useState(false);
  const kevinScale = useRef(new Animated.Value(0.35)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setShowCard(false);
    kevinScale.setValue(0.35);
    cardOpacity.setValue(0);

    let cardTimer: ReturnType<typeof setTimeout> | null = null;

    const zoom = Animated.timing(kevinScale, {
      toValue: 1.08,
      duration: KEVIN_ZOOM_MS,
      useNativeDriver: true,
    });

    zoom.start(({ finished }) => {
      if (!finished) {
        return;
      }

      cardTimer = setTimeout(() => {
        setShowCard(true);
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }).start();
      }, CARD_DELAY_MS);
    });

    return () => {
      zoom.stop();
      if (cardTimer) {
        clearTimeout(cardTimer);
      }
    };
  }, [cardOpacity, kevinScale]);

  return (
    <View style={styles.overlay}>
      <View style={styles.kevinStage}>
        <Animated.View style={[styles.kevinCloseup, { transform: [{ scale: kevinScale }] }]}>
          <Image source={CHARACTER_HEADS.kevin} style={styles.kevinHead} contentFit="contain" />
        </Animated.View>
      </View>

      {showCard && (
        <Animated.View style={[styles.cardWrap, { opacity: cardOpacity }]}>
          <View style={endScreenCardStyles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <View style={endScreenCardStyles.buttonRow}>
              <Pressable
                onPress={onRestart}
                style={({ pressed }) => [styles.button, styles.restartButton, pressed && styles.buttonPressed]}>
                <Text style={styles.buttonText}>Nochmal spielen</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 10, 6, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 100,
  },
  kevinStage: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kevinCloseup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  kevinHead: {
    width: 300,
    height: 300,
  },
  cardWrap: {
    position: 'absolute',
    bottom: '12%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FF5252',
    fontFamily: 'Courier',
    textAlign: 'center',
    transform: [{ rotate: '-2deg' }],
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '800',
    color: '#6B5344',
    fontFamily: 'Courier',
    textAlign: 'center',
    fontStyle: 'italic',
    transform: [{ rotate: '1deg' }],
    lineHeight: 22,
  },
  button: {
    borderWidth: 3,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  restartButton: {
    backgroundColor: '#EC407A',
    borderColor: '#AD1457',
    transform: [{ rotate: '-2deg' }],
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '900',
    fontFamily: 'Courier',
    letterSpacing: 0.5,
  },
});
