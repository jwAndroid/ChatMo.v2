import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { Text } from 'react-native';

import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { RootState } from '../../redux/rootReducer';
import { IconHeader, SafeAreaContainer } from '../../components';

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Room'>;

function RoomScreen() {
  const user = useSelector((state: RootState) => state.auth.user);

  const navigation = useNavigation<RootStackNavigationProp>();

  const { params } = useRoute<RoomScreenRouteProp>();
  console.log(params);

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPress = useCallback(() => {
    console.log(user);
  }, [user]);

  return (
    <SafeAreaContainer>
      <IconHeader isBackButton onPress={onBackPress} />

      <Text style={{ fontSize: 25, marginTop: 20 }} onPress={onPress}>
        getUser
      </Text>
    </SafeAreaContainer>
  );
}

export default memo(RoomScreen);
