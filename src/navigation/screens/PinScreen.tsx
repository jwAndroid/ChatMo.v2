import React, { memo, useCallback, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import styled from '@emotion/native';

import { useTheme } from '@emotion/react';
import { useSelector } from 'react-redux';
import {
  IconHeader,
  KeyboardContainer,
  SafeAreaContainer,
} from '../../components';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { RootState } from '../../redux/rootReducer';

const TitleInput = styled.TextInput(() => ({
  width: '100%',
  height: 50,
  color: 'white',
  backgroundColor: 'gray',
}));

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
  const from = useSelector((state: RootState) => state.system.from);

  const theme = useTheme();
  const [value, setValue] = useState('');

  const { params } = useRoute<PinScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();

  const onBackPress = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  const onSubmitEditing = useCallback(() => {
    if (params) {
      const password = params?.password;

      if (password === value) {
        if (from === 'Modify') {
          navigation.navigate('Modify', params);
        } else {
          navigation.navigate('Room', params);
        }

        console.log(`confirm! ${from}으로 이동하세요.`);
      } else {
        console.log('invailed!');
      }
    }
  }, [navigation, params, value, from]);

  return (
    <SafeAreaContainer>
      <KeyboardContainer>
        <IconHeader isBackword onPress={onBackPress} />

        <Icon source={theme.icon.lock} />

        <TitleInput
          value={value}
          onChangeText={setValue}
          onSubmitEditing={onSubmitEditing}
        />
      </KeyboardContainer>
    </SafeAreaContainer>
  );
}

export default memo(PinScreen);
