import React, { memo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { View, Text } from 'react-native';

import { RootStackNavigationProp } from '../RootStack';

function RoomsScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const onPress = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  const onPressRoom = useCallback(() => {
    const room = { id: 1, title: 'hello wolrd' };

    navigation.navigate('Room', room);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Rooms</Text>

      <Text onPress={onPress} style={{ fontSize: 20, marginTop: 20 }}>
        go setting
      </Text>

      <Text onPress={onPressRoom} style={{ fontSize: 20, marginTop: 20 }}>
        go Room
      </Text>
    </View>
  );
}

export default memo(RoomsScreen);
