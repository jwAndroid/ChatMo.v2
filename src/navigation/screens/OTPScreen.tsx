import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { IconHeader, SafeAreaContainer } from '../../components';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';

const ContentsContainer = styled.Pressable(() => ({
  flex: 1,
  paddingTop: 50,
  alignItems: 'center',
}));

const InvailedContainer = styled.View(() => ({
  marginTop: 20,
  alignItems: 'center',
}));

const InvailedText = styled.Text(({ theme }) => ({
  fontSize: 15,
  color: theme.color.text,
}));

const Icon = styled.Image(({ theme }) => ({
  width: 80,
  height: 80,
  marginBottom: 30,
  tintColor: theme.color.icon,
}));

const CELL_COUNT = 4;
const CELL_SIZE = 40;

const { Value, Text: AnimatedText } = Animated;

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));

const animateCell = ({
  hasValue,
  index,
  isFocused,
}: {
  hasValue: boolean;
  index: number;
  isFocused: boolean;
}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      delay: hasValue ? 300 : 250,
    }),
  ]).start();
};

type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTP'>;

function OTPScreen() {
  const theme = useTheme();

  const { params } = useRoute<OTPScreenRouteProp>();

  const navigation = useNavigation<RootStackNavigationProp>();

  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (params?.password && params) {
      const password = params?.password.toString();

      if (value === password) {
        navigation.navigate('Room', params);
      } else if (value.length === 4 && value !== password) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }, [value, params, navigation]);

  const rootStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      height: CELL_SIZE,
      justifyContent: 'center',
    }),
    []
  );

  const cellStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      marginHorizontal: 15,
      height: CELL_SIZE,
      width: CELL_SIZE,
      lineHeight: CELL_SIZE - 5,
      fontSize: 20,
      textAlign: 'center',
      color: 'white',
    }),
    []
  );

  const renderCell = ({ index, symbol, isFocused }: RenderCellOptions) => {
    const hasValue = Boolean(symbol);

    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['#0099ff', '#0099ff'],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['#0099ff', '#0099ff'],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, 10],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    setTimeout(() => {
      animateCell({ hasValue, index, isFocused });
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[cellStyle, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {symbol || (isFocused ? <Cursor cursorSymbol="_" /> : null)}
      </AnimatedText>
    );
  };

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onPressLayout = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <SafeAreaContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding' })}
      >
        <IconHeader isBackword onPress={onBackPress} />

        <ContentsContainer onPress={onPressLayout}>
          <Icon source={theme.icon.lock} />

          <CodeField
            {...props}
            ref={ref}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={rootStyle}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={renderCell}
          />

          {error ? (
            <InvailedContainer>
              <InvailedText>비밀번호가 잘못되었습니다.</InvailedText>
            </InvailedContainer>
          ) : null}
        </ContentsContainer>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
}

export default memo(OTPScreen);
