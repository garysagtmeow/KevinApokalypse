import { Pressable, StyleSheet, Text, View } from 'react-native';

type ActionButtonProps = {
  onPress?: () => void;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
  active: boolean;
  label?: string;
  holdProgress?: number;
  showHoldBar?: boolean;
};

export function ActionButton({
  onPress,
  onHoldStart,
  onHoldEnd,
  active,
  label = 'Aufräumen!',
  holdProgress = 0,
  showHoldBar = false,
}: ActionButtonProps) {
  const useHold = Boolean(onHoldStart && onHoldEnd);

  return (
    <Pressable
      onPress={useHold ? undefined : onPress}
      onPressIn={useHold ? onHoldStart : undefined}
      onPressOut={useHold ? onHoldEnd : undefined}
      style={({ pressed }) => [
        styles.button,
        active && styles.buttonActive,
        pressed && styles.buttonPressed,
      ]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
      {showHoldBar && (
        <View style={styles.holdTrack}>
          <View style={[styles.holdFill, { width: `${Math.round(holdProgress * 100)}%` }]} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#B71C1C',
    borderWidth: 3,
    borderColor: '#7F0000',
    borderRadius: 12,
    paddingHorizontal: 28,
    paddingVertical: 18,
    transform: [{ rotate: '3deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    opacity: 0.55,
    minWidth: 190,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#D32F2F',
    opacity: 1,
    borderColor: '#FFD54F',
  },
  buttonPressed: {
    transform: [{ rotate: '3deg' }, { scale: 0.95 }],
  },
  label: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Courier',
    letterSpacing: 1,
    textAlign: 'center',
  },
  labelActive: {
    color: '#FFEB3B',
  },
  holdTrack: {
    marginTop: 8,
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#7F0000',
  },
  holdFill: {
    height: '100%',
    backgroundColor: '#FFEB3B',
    borderRadius: 3,
  },
});
