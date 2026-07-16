import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BonusLevelButton } from './BonusLevelButton';
import { Confetti } from './Confetti';
import { endScreenCardStyles } from './end-screen-card';

type SecondaryAction =
  | { variant: 'next'; onPress: () => void }
  | { variant: 'bonus'; onPress: () => void };

type LevelCompleteOverlayProps = {
  title: string;
  subtitle: string;
  onRestart: () => void;
  secondaryAction?: SecondaryAction | null;
};

export function LevelCompleteOverlay({
  title,
  subtitle,
  onRestart,
  secondaryAction = null,
}: LevelCompleteOverlayProps) {
  return (
    <View style={styles.overlay}>
      <Confetti />
      <View style={endScreenCardStyles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={endScreenCardStyles.buttonRow}>
          <Pressable
            onPress={onRestart}
            style={({ pressed }) => [styles.button, styles.restartButton, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Nochmal!</Text>
          </Pressable>
          {secondaryAction?.variant === 'next' && (
            <Pressable
              onPress={secondaryAction.onPress}
              style={({ pressed }) => [styles.button, styles.nextLevelButton, pressed && styles.buttonPressed]}>
              <Text style={styles.buttonText}>Nächstes Level!</Text>
            </Pressable>
          )}
          {secondaryAction?.variant === 'bonus' && (
            <BonusLevelButton onPress={secondaryAction.onPress} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(44, 24, 16, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 100,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2E7D32',
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
  nextLevelButton: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20',
    transform: [{ rotate: '2deg' }],
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
