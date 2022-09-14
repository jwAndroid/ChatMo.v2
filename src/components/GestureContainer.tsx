import React, { memo } from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';

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
  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={{
        velocityThreshold: 1,
        directionalOffsetThreshold: 80,
        gestureIsClickThreshold: 10,
      }}
      style={{
        flex: 1,
      }}
    >
      {children}
    </GestureRecognizer>
  );
}

export default memo(GestureContainer);
