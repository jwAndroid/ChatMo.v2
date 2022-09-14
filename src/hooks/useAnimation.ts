import { useCallback, useRef, useMemo } from 'react';
import { Animated, LayoutAnimation } from 'react-native';

export function useAnimation() {
  const anim = useRef(new Animated.Value(0));

  const style = useMemo(
    () => ({ transform: [{ translateX: anim.current }] }),
    []
  );

  const deleteConfig = useMemo(
    () => ({
      duration: 200,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        duration: 50,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    }),
    []
  );

  const onLayoutAnimation = useCallback(
    () => LayoutAnimation.configureNext(deleteConfig),
    [deleteConfig]
  );

  const shake = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim.current, {
          useNativeDriver: true,
          toValue: 5,
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
    onLayoutAnimation,
  };
}
