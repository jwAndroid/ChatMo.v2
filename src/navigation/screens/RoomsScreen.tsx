import React, { memo, useCallback } from 'react';
import { Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { useTheme } from '@emotion/react';

import { RootStackNavigationProp } from '../RootStack';
import { IconHeader, SafeAreaContainer } from '../../components';
import { changeTheme } from '../../redux/system/slice';

function RoomsScreen() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const navigation = useNavigation<RootStackNavigationProp>();

  const onPress = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  const onDispatch = useCallback(() => {
    dispatch(changeTheme({ isDark: true }));
  }, [dispatch]);

  return (
    <SafeAreaContainer>
      <IconHeader title="목록" onPress={onPress} />

      <Text style={{ color: theme.color.text }} onPress={onDispatch}>
        dispatch
      </Text>
    </SafeAreaContainer>
  );
}

export default memo(RoomsScreen);
