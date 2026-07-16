import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Confetti } from './Confetti';
import { endScreenCardStyles } from './end-screen-card';

type BonusEndOverlayProps = {
  score: number;
  rank: string;
  onReplay: () => void;
  onMenu: () => void;
};

export function BonusEndOverlay({ score, rank, onReplay, onMenu }: BonusEndOverlayProps) {
  return (
    <View style={styles.overlay}>
      <Confetti />
      <View style={endScreenCardStyles.card}>
        <Text style={styles.title}>BONUSLEVEL BEENDET</Text>
        <Text style={styles.subtitle}>
          Kevin hat {score} Käseecken vernichtet. Reue wurde nicht festgestellt.
        </Text>
        <Text style={styles.rank}>{rank}</Text>
        <View style={endScreenCardStyles.buttonRow}>
          <Pressable
            onPress={onReplay}
            style={({ pressed }) => [styles.button, styles.restartButton, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Nochmal!</Text>
          </Pressable>
          <Pressable
            onPress={onMenu}
            style={({ pressed }) => [styles.button, styles.menuButton, pressed && styles.buttonPressed]}>
            <Text style={styles.buttonText}>Hauptmenü!</Text>
          </Pressable>
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
    lineHeight: 22,
  },
  rank: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '900',
    color: '#2E7D32',
    fontFamily: 'Courier',
    textAlign: 'center',
    fontStyle: 'italic',
    transform: [{ rotate: '-1deg' }],
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
  menuButton: {
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
