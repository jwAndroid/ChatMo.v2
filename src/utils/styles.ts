import { useMemo } from 'react';
import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '@emotion/react';
import { LeftRightStyle } from 'react-native-gifted-chat';

export function SwipeStyles() {
  const theme = useTheme();

  const Row = useMemo<StyleProp<ViewStyle>>(
    () => ({
      height: 65,
      justifyContent: 'center',
      backgroundColor: theme.color.background,
      borderBottomColor: theme.color.background,
      borderBottomWidth: 1,
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

  const ModifyButton = useMemo<StyleProp<ViewStyle>>(
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
    ModifyButton,
    DeleteButton,
  };
}

export function ChatBubbleStyle() {
  const theme = useTheme();

  const ContainerStyle = useMemo<LeftRightStyle<ViewStyle>>(
    () => ({
      right: {
        flex: 1,
        marginVertical: 5,
      },
    }),
    []
  );

  const WrapperStyle = useMemo<LeftRightStyle<ViewStyle>>(
    () => ({
      right: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingVertical: 3,
        backgroundColor: theme.color.sky_300,
      },
    }),
    [theme]
  );

  const BottomContainerStyle = useMemo<LeftRightStyle<ViewStyle>>(
    () => ({
      right: {
        alignItems: 'center',
        marginBottom: 3,
      },
    }),
    []
  );

  const TimeTextStyle = useMemo<LeftRightStyle<TextStyle>>(
    () => ({
      right: {
        fontSize: 9,
        color: theme.color.white,
        includeFontPadding: false,
      },
    }),
    [theme]
  );

  const TimeContainerStyle = useMemo<LeftRightStyle<ViewStyle>>(
    () => ({
      right: {
        marginBottom: 1,
        marginRight: 1,
      },
    }),
    []
  );

  const PreviousStyle = useMemo<LeftRightStyle<ViewStyle>>(
    () => ({
      right: {
        borderTopRightRadius: 2,
        marginTop: -5,
      },
    }),
    []
  );

  const NextStyle = useMemo<LeftRightStyle<ViewStyle>>(
    () => ({
      right: { borderBottomRightRadius: 2 },
    }),
    []
  );

  return {
    ContainerStyle,
    WrapperStyle,
    BottomContainerStyle,
    TimeTextStyle,
    TimeContainerStyle,
    PreviousStyle,
    NextStyle,
  };
}

export function ChatInputBarStyles() {
  const theme = useTheme();

  const PrimaryStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      flex: 1,
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? undefined : 7,
      paddingBottom: Platform.OS === 'ios' ? undefined : 3,
      paddingLeft: 10,
      paddingRight: 20,
      backgroundColor: theme.color.background,
    }),
    [theme]
  );

  const ContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      marginBottom: 5,
    }),
    []
  );

  return {
    PrimaryStyle,
    ContainerStyle,
  };
}
