import React, { memo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { Text } from 'react-native';

import { RootStackNavigationProp } from '../RootStack';
import { IconHeader, SafeAreaContainer } from '../../components';

function ThemeScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaContainer>
      <IconHeader title="테마설정" isBackButton onPress={onBackPress} />

      <Text onPress={() => navigation.pop()}>ThemeScreen onpress</Text>
    </SafeAreaContainer>
  );
}

export default memo(ThemeScreen);
