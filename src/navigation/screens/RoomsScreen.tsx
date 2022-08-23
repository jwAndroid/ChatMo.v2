import React, { memo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';

import { RootStackNavigationProp } from '../RootStack';
import { IconHeader, SafeAreaContainer } from '../../components';

function RoomsScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const onPress = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  return (
    <SafeAreaContainer>
      <IconHeader title="목록" onPress={onPress} />
    </SafeAreaContainer>
  );
}

export default memo(RoomsScreen);
