import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';

import { RootState } from '../../redux/rootReducer';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import {
  IconHeader,
  KeyboardContainer,
  Pin,
  SafeAreaContainer,
} from '../../components';

const Icon = styled.Image(({ theme }) => ({
  width: 80,
  height: 80,
  marginBottom: 30,
  tintColor: theme.color.icon,
  marginVertical: 20,
  alignSelf: 'center',
}));

type PinScreenRouteProp = RouteProp<RootStackParamList, 'Pin'>;

function PinScreen() {
  const theme = useTheme();

  const from = useSelector((state: RootState) => state.system.from);

  const { params } = useRoute<PinScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();

  console.log(`params: ${params}`);
  console.log(`from: ${from}`);

  const onBackPress = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  // const onSubmitEditing = useCallback(() => {
  //   if (params) {
  //     const password = params?.password;

  //     if (password === '1234') {
  //       if (from === 'Modify') {
  //         navigation.navigate('Modify', params);
  //       } else {
  //         navigation.navigate('Room', params);
  //       }
  //     } else {
  //       console.log('invailed!');
  //     }
  //   }
  // }, [navigation, params, from]);

  return (
    <SafeAreaContainer>
      <KeyboardContainer>
        <IconHeader isBackword onPress={onBackPress} />

        <Icon source={theme.icon.lock} />

        <Pin />
      </KeyboardContainer>
    </SafeAreaContainer>
  );
}

export default memo(PinScreen);
