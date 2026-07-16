import { Platform, StyleSheet, Text, View } from 'react-native';

type TimmyChokingBannerProps = {
  breathRemaining: number;
};

export function TimmyChokingBanner({ breathRemaining }: TimmyChokingBannerProps) {
  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.warningBadge}>
        <Text style={styles.warningIcon}>!</Text>
      </View>
      <View style={styles.banner}>
        <Text style={styles.title}>TIMMY VERSCHLUCKT SICH!</Text>
        <Text style={styles.countdown}>Atem: {breathRemaining}s</Text>
        {Platform.OS === 'web' && (
          <Text selectable={false} style={styles.rescueHint}>
            Orangen Kreis-Button 2 Sekunden gedrückt halten!
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
    paddingTop: 6,
  },
  warningBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D32F2F',
    borderWidth: 3,
    borderColor: '#7F0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    transform: [{ rotate: '-6deg' }],
  },
  warningIcon: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Courier',
    lineHeight: 24,
  },
  banner: {
    backgroundColor: 'rgba(183, 28, 28, 0.92)',
    borderWidth: 3,
    borderColor: '#7F0000',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    transform: [{ rotate: '-1deg' }],
  },
  title: {
    color: '#FFEB3B',
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'Courier',
    letterSpacing: 0.5,
  },
  countdown: {
    marginTop: 2,
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'Courier',
  },
  rescueHint: {
    marginTop: 6,
    color: '#FFEB3B',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'Courier',
    textAlign: 'center',
    lineHeight: 15,
  },
});
