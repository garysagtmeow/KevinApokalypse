import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TutorialHintProps = {
  sessionKey: number;
  message: string;
  onDismiss: () => void;
};

export function TutorialHint({ sessionKey, message, onDismiss }: TutorialHintProps) {
  const [visible, setVisible] = useState(true);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const dismiss = () => {
    setVisible(false);
    onDismissRef.current();
  };

  useEffect(() => {
    setVisible(true);
  }, [sessionKey]);

  if (!visible) {
    return null;
  }

  return (
    <Pressable style={styles.overlay} onPress={dismiss}>
      <View style={styles.card}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.dismissHint}>Tippen zum Schließen</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(44, 24, 16, 0.35)',
    zIndex: 100,
    elevation: 100,
  },
  card: {
    backgroundColor: 'rgba(255, 245, 220, 0.97)',
    borderWidth: 3,
    borderColor: '#3D2914',
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 16,
    maxWidth: '78%',
    transform: [{ rotate: '-1deg' }],
    shadowColor: '#3D2914',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 0,
  },
  message: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2C1810',
    fontFamily: 'Courier',
    textAlign: 'center',
    lineHeight: 22,
  },
  dismissHint: {
    marginTop: 10,
    fontSize: 10,
    color: '#6B5344',
    fontFamily: 'Courier',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
