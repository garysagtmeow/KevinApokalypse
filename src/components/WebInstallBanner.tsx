import { useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  WEB_INSTALL_DISMISS_KEY,
  shouldShowWebInstallPrompt,
} from '@/src/utils/web-install';

function isIosDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return /iPhone|iPad|iPod/i.test(window.navigator.userAgent);
}

function InstallStep({ number, title, detail }: { number: string; title: string; detail: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{number}</Text>
      </View>
      <View style={styles.stepCopy}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDetail}>{detail}</Text>
      </View>
    </View>
  );
}

export function WebInstallBanner() {
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(true);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    if (!shouldShowWebInstallPrompt()) {
      return;
    }

    setIsIos(isIosDevice());

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
    <View style={styles.overlay}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.alertBanner}>
            <Text style={styles.alertBannerText}>⚠️ BITTE ZUERST LESEN ⚠️</Text>
          </View>

          <Text style={styles.title}>App auf den Home-Bildschirm legen!</Text>
          <Text style={styles.subtitle}>
            Nur so verschwindet die Safari-Leiste oben.{'\n'}
            Sonst verdeckt sie das Spiel.
          </Text>

          {isIos ? (
            <>
              <InstallStep
                number="1"
                title="Unten in Safari auf TEILEN tippen"
                detail="Das ist das Quadrat mit dem Pfeil nach oben ⬆️ (unten in der Leiste)."
              />
              <InstallStep
                number="2"
                title="„Zum Home-Bildschirm“ wählen"
                detail="Etwas nach unten scrollen, bis du es siehst."
              />
              <InstallStep
                number="3"
                title="Oben rechts auf HINZUFÜGEN tippen"
                detail="Damit erscheint das Kevin-Icon auf dem Home-Bildschirm."
              />
              <InstallStep
                number="4"
                title="Safari schließen & Kevin-Icon öffnen"
                detail="Nicht die Website in Safari öffnen — das neue Icon antippen!"
              />
            </>
          ) : (
            <>
              <InstallStep
                number="1"
                title="Menü oben rechts öffnen (⋮)"
                detail="In Chrome oder deinem Browser."
              />
              <InstallStep
                number="2"
                title="„App installieren“ oder „Zum Startbildschirm“ wählen"
                detail="Je nach Browser heißt der Button etwas anders."
              />
              <InstallStep
                number="3"
                title="App vom Home-Bildschirm starten"
                detail="Nicht aus dem Browser — vom neuen Icon!"
              />
            </>
          )}

          <View style={styles.rememberBox}>
            <Text style={styles.rememberTitle}>Merken:</Text>
            <Text style={styles.rememberText}>
              Im Browser = Safari-Leiste bleibt.{'\n'}
              Vom Home-Bildschirm = Vollbild wie eine richtige App.
            </Text>
          </View>

          <Pressable
            onPress={dismissForSession}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}>
            <Text style={styles.primaryButtonText}>
              Verstanden — ich lege die App auf den Home-Bildschirm
            </Text>
          </Pressable>

          <Pressable onPress={dismissForSession} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              Nur kurz testen (Safari-Leiste bleibt sichtbar)
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 10, 5, 0.94)',
    zIndex: 999,
    elevation: 999,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  card: {
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    backgroundColor: '#FFF8DC',
    borderWidth: 5,
    borderColor: '#E65100',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 0,
    overflow: 'hidden',
  },
  alertBanner: {
    backgroundColor: '#E65100',
    marginHorizontal: -18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  alertBannerText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    fontFamily: 'Courier',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#B71C1C',
    fontFamily: 'Courier',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 18,
    lineHeight: 26,
    color: '#4E342E',
    fontFamily: 'Courier',
    textAlign: 'center',
    fontWeight: '700',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
    backgroundColor: 'rgba(255, 235, 59, 0.35)',
    borderWidth: 3,
    borderColor: '#F9A825',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  stepBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E65100',
    borderWidth: 3,
    borderColor: '#BF360C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Courier',
  },
  stepCopy: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2C1810',
    fontFamily: 'Courier',
    lineHeight: 24,
  },
  stepDetail: {
    marginTop: 4,
    fontSize: 15,
    lineHeight: 22,
    color: '#5D4037',
    fontFamily: 'Courier',
  },
  rememberBox: {
    marginTop: 16,
    backgroundColor: '#FFE082',
    borderWidth: 3,
    borderColor: '#FF8F00',
    borderRadius: 12,
    padding: 14,
  },
  rememberTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E65100',
    fontFamily: 'Courier',
    marginBottom: 4,
  },
  rememberText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4E342E',
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: '#2E7D32',
    borderWidth: 4,
    borderColor: '#1B5E20',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '900',
    fontFamily: 'Courier',
    textAlign: 'center',
    lineHeight: 24,
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#8D6E63',
    fontSize: 12,
    fontFamily: 'Courier',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
