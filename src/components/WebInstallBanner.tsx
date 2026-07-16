import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  WEB_INSTALL_DISMISS_KEY,
  shouldShowWebInstallPrompt,
} from '@/src/utils/web-install';

export function WebInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    if (!shouldShowWebInstallPrompt()) {
      return;
    }

    try {
      const dismissed = window.sessionStorage.getItem(WEB_INSTALL_DISMISS_KEY);
      setVisible(dismissed !== '1');
    } catch {
      setVisible(true);
    }
  }, []);

  const dismissForSession = () => {
    try {
      window.sessionStorage.setItem(WEB_INSTALL_DISMISS_KEY, '1');
    } catch {
      // Ignore storage errors and still hide the banner.
    }
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.card}>
        <Text style={styles.title}>Safari-Leiste stört?</Text>
        <Text style={styles.lead}>
          Im Browser bleiben Tabs und Adresszeile sichtbar — das lässt sich auf dem iPhone nicht
          ausblenden.
        </Text>
        <Text style={styles.stepsTitle}>So geht&apos;s im Vollbild:</Text>
        <Text style={styles.steps}>
          1. Unten auf Teilen tippen{'\n'}
          2. „Zum Home-Bildschirm“ wählen{'\n'}
          3. App vom Home-Bildschirm-Icon starten — nicht in Safari!
        </Text>
        <Pressable
          onPress={dismissForSession}
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}>
          <Text style={styles.primaryButtonText}>Verstanden</Text>
        </Pressable>
        <Pressable onPress={dismissForSession} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Trotzdem in Safari spielen</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(44, 24, 16, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 999,
    elevation: 999,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFF8DC',
    borderWidth: 4,
    borderColor: '#3D2914',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 18,
    transform: [{ rotate: '-1deg' }],
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#E65100',
    fontFamily: 'Courier',
    textAlign: 'center',
  },
  lead: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: '#5D4037',
    fontFamily: 'Courier',
    textAlign: 'center',
  },
  stepsTitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '900',
    color: '#2C1810',
    fontFamily: 'Courier',
  },
  steps: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 22,
    color: '#4E342E',
    fontFamily: 'Courier',
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#2E7D32',
    borderWidth: 3,
    borderColor: '#1B5E20',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Courier',
  },
  secondaryButton: {
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B5344',
    fontSize: 13,
    fontFamily: 'Courier',
    textDecorationLine: 'underline',
  },
});
