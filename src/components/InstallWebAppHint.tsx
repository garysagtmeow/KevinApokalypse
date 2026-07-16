import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

function isStandaloneWebApp() {
  if (typeof window === 'undefined') {
    return true;
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function InstallWebAppHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    setVisible(!isStandaloneWebApp());
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.hint}>
      <Text style={styles.title}>Als App speichern</Text>
      <Text style={styles.text}>
        iPhone: Teilen → „Zum Home-Bildschirm“{'\n'}
        Android: Menü → „App installieren“
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(255, 248, 220, 0.96)',
    borderWidth: 3,
    borderColor: '#3D2914',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    transform: [{ rotate: '-1deg' }],
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: '#E65100',
    fontFamily: 'Courier',
    marginBottom: 4,
  },
  text: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6B5344',
    fontFamily: 'Courier',
  },
});
