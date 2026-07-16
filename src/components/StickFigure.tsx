import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import type { ImageSource } from 'expo-image';

type StickFigureProps = {
  head: ImageSource;
  body: ImageSource;
  headSize: number;
  bodyWidth: number;
  bodyHeight: number;
  bodyOffsetY?: number;
  label: string;
  labelStyle?: object;
  style?: object;
  headTilt?: number;
  bodyInForeground?: boolean;
};

export function StickFigure({
  head,
  body,
  headSize,
  bodyWidth,
  bodyHeight,
  bodyOffsetY = 0,
  label,
  labelStyle,
  style,
  headTilt = 0,
  bodyInForeground = false,
}: StickFigureProps) {
  const bodyLayerStyle = bodyInForeground ? styles.bodyForeground : styles.bodyImage;
  const headLayerStyle = bodyInForeground ? styles.headForeground : styles.headImage;

  return (
    <View style={[styles.figure, style]}>
      <Image
        source={head}
        style={[
          headLayerStyle,
          {
            width: headSize,
            height: headSize,
            transform: [{ rotate: `${headTilt}deg` }],
          },
        ]}
        contentFit="contain"
      />

      <Image
        source={body}
        style={[
          bodyLayerStyle,
          {
            width: bodyWidth,
            height: bodyHeight,
            marginTop: bodyOffsetY,
          },
        ]}
        contentFit="contain"
      />

      <Text style={[styles.figureLabel, labelStyle]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  figure: {
    alignItems: 'center',
    position: 'relative',
  },
  headImage: {
    zIndex: 2,
  },
  headForeground: {
    zIndex: 4,
  },
  bodyImage: {
    marginTop: -8,
    zIndex: 1,
  },
  bodyForeground: {
    marginTop: -8,
    zIndex: 3,
  },
  figureLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '800',
    color: '#2C1810',
    fontFamily: 'Courier',
    transform: [{ rotate: '-3deg' }],
  },
});
