import React, { memo, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import GestureRecognizer, {
  GestureRecognizerConfig,
} from 'react-native-swipe-gestures';

interface IGestureContainer {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

function GestureContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
}: IGestureContainer) {
  const style = useMemo<StyleProp<ViewStyle>>(() => ({ flex: 1 }), []);

  const config = useMemo<GestureRecognizerConfig>(
    () => ({
      velocityThreshold: 1,
      directionalOffsetThreshold: 80,
      gestureIsClickThreshold: 10,
    }),
    []
  );

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={config}
      style={style}
    >
      {children}
    </GestureRecognizer>
  );
}

export default memo(GestureContainer);
