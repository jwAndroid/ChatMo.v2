import { useNavigation } from '@react-navigation/core';
import React, { memo, useCallback } from 'react';
import { View, Text } from 'react-native';
import { RootStackNavigationProp } from '../RootStack';

function SettingScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text onPress={onBackPress}>back</Text>
    </View>
  );
}

export default memo(SettingScreen);
