import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React, { memo, useCallback } from 'react';
import { IconHeader, SafeAreaContainer } from '../../components';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';

type ModifyScreenRouteProp = RouteProp<RootStackParamList, 'Modify'>;

function ModifyScreen() {
  const { params } = useRoute<ModifyScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();

  console.log(JSON.stringify(params, null, 5));

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  return (
    <SafeAreaContainer>
      <IconHeader isLeftIcon onPress={onBackPress} />
      {/* TODO: password, chips, title, isCompleate, createdAt */}
    </SafeAreaContainer>
  );
}

export default memo(ModifyScreen);
