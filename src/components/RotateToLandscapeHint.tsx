import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { isMobileWebBrowser, isStandaloneWebApp } from '@/src/utils/web-install';

function readIsPortrait(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(orientation: portrait)').matches || window.innerHeight > window.innerWidth;
}

export function RotateToLandscapeHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || !isMobileWebBrowser()) {
      return;
    }

    const update = () => {
      setVisible(isStandaloneWebApp() && readIsPortrait());
    };

    update();

    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);

    const media = window.matchMedia('(orientation: portrait)');
    media.addEventListener('change', update);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      media.removeEventListener('change', update);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.icon}>📱 ↻</Text>
        <Text style={styles.title}>Handy ins Querformat drehen!</Text>
        <Text style={styles.subtitle}>
          Kevin Apocalypse spielt man quer.{'\n'}
          Bitte das Handy seitlich drehen.
        </Text>
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>
            Home-Taste / Dynamic Island nach links oder rechts —{'\n'}
            so wie beim Filme schauen.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 10, 5, 0.96)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 998,
    elevation: 998,
  },
  card: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#FFF8DC',
    borderWidth: 5,
    borderColor: '#E65100',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#B71C1C',
    fontFamily: 'Courier',
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 20,
    lineHeight: 28,
    color: '#4E342E',
    fontFamily: 'Courier',
    textAlign: 'center',
    fontWeight: '700',
  },
  hintBox: {
    marginTop: 18,
    backgroundColor: '#FFE082',
    borderWidth: 3,
    borderColor: '#FF8F00',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
  },
  hintText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#5D4037',
    fontFamily: 'Courier',
    textAlign: 'center',
    fontWeight: '700',
  },
});
