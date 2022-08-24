import { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@emotion/react';

export default function useStyles() {
  const theme = useTheme();

  const Row = useMemo<StyleProp<ViewStyle>>(
    () => ({
      height: 60,
      justifyContent: 'center',
      backgroundColor: theme.color.background,
    }),
    [theme]
  );

  const EditButton = useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: 'absolute',
      bottom: 0,
      top: 0,
      width: 75,
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.sky_100,
    }),
    [theme]
  );

  const FavoritButton = useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: 'absolute',
      bottom: 0,
      top: 0,
      width: 75,
      left: 75,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.sky_200,
    }),
    [theme]
  );

  const LockButton = useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: 'absolute',
      bottom: 0,
      top: 0,
      width: 75,
      left: 150,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.sky_300,
    }),
    [theme]
  );

  const DeleteButton = useMemo<StyleProp<ViewStyle>>(
    () => ({
      position: 'absolute',
      bottom: 0,
      top: 0,
      width: 75,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.red,
    }),
    [theme]
  );

  return {
    Row,
    EditButton,
    FavoritButton,
    LockButton,
    DeleteButton,
  };
}
