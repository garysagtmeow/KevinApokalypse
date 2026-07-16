import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { WEB_NO_SELECT_STYLE } from '@/src/utils/web-no-select';

type HoldPressableProps = {
  onHoldStart: () => void;
  onHoldEnd: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

function getHoldTarget(element: View | null): HTMLElement | null {
  if (!element) {
    return null;
  }

  return element as unknown as HTMLElement;
}

export function HoldPressable({
  onHoldStart,
  onHoldEnd,
  disabled = false,
  style,
  children,
}: HoldPressableProps) {
  const targetRef = useRef<View>(null);
  const holdingRef = useRef(false);
  const onHoldStartRef = useRef(onHoldStart);
  const onHoldEndRef = useRef(onHoldEnd);
  const disabledRef = useRef(disabled);
  onHoldStartRef.current = onHoldStart;
  onHoldEndRef.current = onHoldEnd;
  disabledRef.current = disabled;

  useLayoutEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const element = getHoldTarget(targetRef.current);
    if (!element) {
      return;
    }

    element.classList.add('hold-pressable');

    const blockDefault = (event: Event) => {
      event.preventDefault();
    };

    const startHold = (event: Event) => {
      if (disabledRef.current || holdingRef.current) {
        return;
      }

      event.preventDefault();
      holdingRef.current = true;
      onHoldStartRef.current();
    };

    const endHold = () => {
      if (!holdingRef.current) {
        return;
      }

      holdingRef.current = false;
      onHoldEndRef.current();
    };

    element.addEventListener('selectstart', blockDefault);
    element.addEventListener('contextmenu', blockDefault);
    element.addEventListener('dragstart', blockDefault);
    element.addEventListener('pointerdown', startHold);
    element.addEventListener('pointerup', endHold);
    element.addEventListener('pointercancel', endHold);
    element.addEventListener('pointerleave', endHold);

    return () => {
      element.classList.remove('hold-pressable');
      element.removeEventListener('selectstart', blockDefault);
      element.removeEventListener('contextmenu', blockDefault);
      element.removeEventListener('dragstart', blockDefault);
      element.removeEventListener('pointerdown', startHold);
      element.removeEventListener('pointerup', endHold);
      element.removeEventListener('pointercancel', endHold);
      element.removeEventListener('pointerleave', endHold);
    };
  }, []);

  useEffect(() => {
    if (!disabled) {
      return;
    }

    holdingRef.current = false;
  }, [disabled]);

  if (Platform.OS === 'web') {
    return (
      <View
        ref={targetRef}
        style={[
          style,
          WEB_NO_SELECT_STYLE,
          styles.webTarget,
          disabled && styles.webTargetDisabled,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled }}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        if (disabled) {
          return;
        }
        onHoldStart();
      }}
      onPressOut={onHoldEnd}
      style={style}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  webTarget: {
    touchAction: 'none',
    cursor: 'pointer',
  },
  webTargetDisabled: {
    cursor: 'default',
    opacity: 0.55,
  },
});
