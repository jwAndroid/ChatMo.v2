import { useCallback, useRef, useMemo } from 'react';
import { Animated } from 'react-native';

export function useShakeAnimation() {
  const anim = useRef(new Animated.Value(0));

  const style = useMemo(
    () => ({ transform: [{ translateX: anim.current }] }),
    []
  );

  const shake = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim.current, {
          useNativeDriver: true,
          toValue: -2,
          duration: 50,
        }),
        Animated.timing(anim.current, {
          useNativeDriver: true,
          toValue: 2,
          duration: 50,
        }),
        Animated.timing(anim.current, {
          useNativeDriver: true,
          toValue: 0,
          duration: 50,
        }),
      ]),

      { iterations: 2 }
    ).start();
  }, []);

  return {
    style,
    shake,
  };
}
