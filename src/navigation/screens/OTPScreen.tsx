import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import styled from '@emotion/native';
import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import { IconHeader } from '../../components';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';

const Container = styled.SafeAreaView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.color.background,
}));

const InvailedContainer = styled.View(() => ({
  marginTop: 20,
  alignItems: 'center',
}));

const InvailedText = styled.Text(({ theme }) => ({
  fontSize: 15,
  color: theme.color.red,
}));

const CELL_COUNT = 4;
const CELL_SIZE = 50;
const CELL_BORDER_RADIUS = 8;
const DEFAULT_CELL_BG_COLOR = '#3557b7';
const NOT_EMPTY_CELL_BG_COLOR = '#3557b7';
const ACTIVE_CELL_BG_COLOR = 'skyblue';

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
  const { params } = useRoute<OTPScreenRouteProp>();

  const navigation = useNavigation<RootStackNavigationProp>();

  console.log(JSON.stringify(params, null, 5));

  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (params && value === params.password.toString()) {
      navigation.navigate('Room', params);
    } else if (
      params &&
      value.length === 4 &&
      value !== params.password.toString()
    ) {
      setError(true);
    } else {
      setError(false);
    }
  }, [value, params, navigation]);

  const rootStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      height: CELL_SIZE,
      paddingHorizontal: 20,
      justifyContent: 'center',
    }),
    []
  );

  const cellStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      marginHorizontal: 10,
      height: CELL_SIZE,
      width: CELL_SIZE,
      lineHeight: CELL_SIZE - 5,
      fontSize: 20,
      textAlign: 'center',
      color: '#3759b8',
    }),
    []
  );

  const renderCell = ({ index, symbol, isFocused }: RenderCellOptions) => {
    const hasValue = Boolean(symbol);

    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
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

  return (
    <Container>
      <IconHeader isLeftIcon onPress={onBackPress} />

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
    </Container>
  );
}

export default memo(OTPScreen);
