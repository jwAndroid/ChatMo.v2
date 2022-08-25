import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { View, Text } from 'react-native';

import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { RootState } from '../../redux/rootReducer';

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Room'>;

function RoomScreen() {
  const user = useSelector((state: RootState) => state.auth.user);

  const navigation = useNavigation<RootStackNavigationProp>();

  const { params } = useRoute<RoomScreenRouteProp>();
  console.log(params);

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPress = () => {
    console.log(user?.userId);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>RoomScreen</Text>

      <Text onPress={onBackPress}>onBack</Text>

      <Text onPress={onPress}>get user</Text>
    </View>
  );
}

export default memo(RoomScreen);
