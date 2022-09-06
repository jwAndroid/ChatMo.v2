import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';

import { View } from 'react-native';
import { RootState } from '../../redux/rootReducer';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { IconHeader, Pin, SafeAreaContainer } from '../../components';

type PinScreenRouteProp = RouteProp<RootStackParamList, 'Pin'>;

function PinScreen() {
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
      <IconHeader isBackword onPress={onBackPress} />

      <Pin />
    </SafeAreaContainer>
  );
}

export default memo(PinScreen);
