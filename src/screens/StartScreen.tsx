import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function StartScreen() {
  const router = useRouter();

  const handleStart = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/game');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerBlock}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>KEVIN APOCALYPSE</Text>
          <Text style={styles.subtitle}>&quot;Kevin war das nicht.&quot;</Text>
        </View>

        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}>
          <Text style={styles.startButtonText}>Spiel starten</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E4C8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  centerBlock: {
    alignItems: 'center',
    gap: 40,
    maxWidth: '92%',
  },
  titleBox: {
    borderWidth: 4,
    borderColor: '#3D2914',
    backgroundColor: 'rgba(255, 245, 220, 0.92)',
    paddingHorizontal: 36,
    paddingVertical: 28,
    borderRadius: 12,
    alignItems: 'center',
    transform: [{ rotate: '-1deg' }],
    shadowColor: '#3D2914',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 0,
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: '#2C1810',
    fontFamily: 'Courier',
    textAlign: 'center',
    letterSpacing: 2,
    transform: [{ rotate: '-2deg' }],
  },
  subtitle: {
    marginTop: 14,
    fontSize: 20,
    color: '#6B5344',
    fontFamily: 'Courier',
    fontStyle: 'italic',
    textAlign: 'center',
    transform: [{ rotate: '2deg' }],
  },
  startButton: {
    backgroundColor: '#2E7D32',
    borderWidth: 4,
    borderColor: '#1B5E20',
    borderRadius: 14,
    paddingHorizontal: 48,
    paddingVertical: 22,
    transform: [{ rotate: '2deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 0,
  },
  startButtonPressed: {
    transform: [{ rotate: '2deg' }, { scale: 0.96 }],
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
});
