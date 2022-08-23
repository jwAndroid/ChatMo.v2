import React, { memo, useCallback } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { View, Text } from 'react-native';

import { RootStackNavigationProp, RootStackParamList } from '../RootStack';

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Room'>;

function RoomScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const { params } = useRoute<RoomScreenRouteProp>();

  console.log(params?.id);

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>RoomScreen</Text>

      <Text onPress={onBackPress}>onBack</Text>
    </View>
  );
}

export default memo(RoomScreen);
