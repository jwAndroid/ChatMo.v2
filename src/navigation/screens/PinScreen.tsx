import React, { memo, useCallback, useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import { RootState } from '../../redux/rootReducer';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { IconHeader, Pin, SafeAreaContainer } from '../../components';
import { useShakeAnimation } from '../../hooks/useAnimation';

const Icon = styled.Image(({ theme }) => ({
  width: 80,
  height: 80,
  tintColor: theme.color.icon,
  alignSelf: 'center',
}));

type PinScreenRouteProp = RouteProp<RootStackParamList, 'Pin'>;

function PinScreen() {
  const from = useSelector((state: RootState) => state.system.from);

  const theme = useTheme();
  const { shake, style } = useShakeAnimation();

  const [pinCode, setPinCode] = useState('');

  const { params } = useRoute<PinScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    if (params && pinCode !== '') {
      console.log(pinCode);
      if (params?.password === pinCode) {
        if (from === 'Modify') {
          navigation.navigate('Modify', params);
        } else {
          navigation.navigate('Room', params);
        }
      } else {
        shake();
      }
    }
  }, [pinCode, navigation, params, from, shake]);

  const onBackPress = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  return (
    <SafeAreaContainer>
      <IconHeader isBackword onPress={onBackPress} />

      <Animated.View style={style}>
        <Icon source={theme.icon.lock} />
      </Animated.View>

      <Pin setPinCode={setPinCode} />
    </SafeAreaContainer>
  );
}

export default memo(PinScreen);
