import { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@emotion/react';

export default function useSwipeStyles() {
  const theme = useTheme();

  const Row = useMemo<StyleProp<ViewStyle>>(
    () => ({
      height: 60,
      justifyContent: 'center',
      backgroundColor: theme.color.background,
    }),
    [theme]
  );

  const FavoritButton = useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 0,
      width: 75,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.sky_100,
    }),
    [theme]
  );

  const LockButton = useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 75,
      width: 75,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.sky_200,
    }),
    [theme]
  );

  const DeleteButton = useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: 'absolute',
      bottom: 0,
      top: 0,
      right: 0,
      width: 75,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.red,
    }),
    [theme]
  );

  return {
    Row,
    FavoritButton,
    LockButton,
    DeleteButton,
  };
}
