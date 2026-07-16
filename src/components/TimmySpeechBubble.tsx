import { StyleSheet, Text, View } from 'react-native';

type TimmySpeechBubbleProps = {
  text: string;
  top?: number;
};

export function TimmySpeechBubble({ text, top = -8 }: TimmySpeechBubbleProps) {
  return (
    <View style={[styles.wrapper, { top }]} pointerEvents="none">
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.tailBorder} />
      <View style={styles.tail} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 88,
    width: 150,
    zIndex: 10,
    transform: [{ rotate: '-3deg' }],
  },
  bubble: {
    backgroundColor: '#FFF9EE',
    borderWidth: 2,
    borderColor: '#2C1810',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: '#2C1810',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
  },
  text: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    color: '#2C1810',
    fontFamily: 'Courier',
    textAlign: 'center',
  },
  tailBorder: {
    position: 'absolute',
    bottom: -10,
    right: 18,
    width: 0,
    height: 0,
    borderTopWidth: 12,
    borderTopColor: '#2C1810',
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 4,
    borderRightColor: 'transparent',
    transform: [{ rotate: '12deg' }],
  },
  tail: {
    position: 'absolute',
    bottom: -7,
    right: 19,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: '#FFF9EE',
    borderLeftWidth: 7,
    borderLeftColor: 'transparent',
    borderRightWidth: 3,
    borderRightColor: 'transparent',
    transform: [{ rotate: '12deg' }],
  },
});
