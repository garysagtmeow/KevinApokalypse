import { Image } from 'expo-image';
import { memo } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

import { CHARACTER_VISUALS } from '@/src/entities/character-assets';
import type { PlayerMovementResult } from '@/src/hooks/use-player-movement';
import type { Vector2 } from '@/src/systems/movement';

const KEVIN_VISUAL = CHARACTER_VISUALS.kevin;
const KEVIN_SIZE = { width: 82, height: 118 };
const IS_WEB = Platform.OS === 'web';

type KevinProps = {
  position?: Vector2;
  animatedStyle?: PlayerMovementResult['animatedStyle'];
  innocent?: boolean;
};

function KevinVisual({ innocent = false }: { innocent?: boolean }) {
  return (
    <>
      <Image
        source={KEVIN_VISUAL.head}
        style={[styles.headImage, innocent && styles.headInnocent]}
        contentFit="contain"
      />
      <Image
        source={KEVIN_VISUAL.body}
        style={[styles.bodyImage, innocent && styles.bodyInnocent]}
        contentFit="contain"
      />
      {!innocent && <Text style={styles.label}>{KEVIN_VISUAL.label}</Text>}
    </>
  );
}

export const Kevin = memo(function Kevin({
  position,
  animatedStyle,
  innocent = false,
}: KevinProps) {
  if (animatedStyle) {
    return (
      <Animated.View
        style={[
          styles.wrapper,
          styles.positioned,
          animatedStyle,
          IS_WEB && styles.wrapperWeb,
        ]}>
        <View style={innocent ? styles.wrapperInnocent : undefined}>
          <KevinVisual innocent={innocent} />
        </View>
      </Animated.View>
    );
  }

  return (
    <View
      style={[
        styles.wrapper,
        styles.positioned,
        innocent && styles.wrapperInnocent,
        IS_WEB && styles.wrapperWeb,
        position && {
          left: position.x - KEVIN_SIZE.width / 2,
          top: position.y - KEVIN_SIZE.height / 2,
        },
      ]}>
      <KevinVisual innocent={innocent} />
    </View>
  );
});

export const KEVIN_ENTITY_SIZE = KEVIN_SIZE;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: KEVIN_SIZE.width,
    zIndex: 2,
    transform: [{ rotate: '-5deg' }],
  },
  positioned: {
    position: 'absolute',
  },
  wrapperWeb: Platform.select({
    web: {
      willChange: 'transform',
    } as object,
    default: {},
  }),
  wrapperInnocent: {
    transform: [{ rotate: '3deg' }, { scale: 0.96 }],
  },
  headImage: {
    width: KEVIN_VISUAL.headSize,
    height: KEVIN_VISUAL.headSize,
    marginTop: KEVIN_VISUAL.headOffsetY,
    zIndex: 2,
  },
  headInnocent: {
    transform: [{ rotate: '12deg' }],
  },
  bodyImage: {
    width: KEVIN_VISUAL.bodyWidth,
    height: KEVIN_VISUAL.bodyHeight,
    marginTop: KEVIN_VISUAL.bodyOffsetY,
    zIndex: 1,
  },
  bodyInnocent: {
    transform: [{ rotate: '-8deg' }],
    marginTop: KEVIN_VISUAL.bodyOffsetY + 6,
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '800',
    color: '#3D2914',
    fontFamily: 'Courier',
  },
});
