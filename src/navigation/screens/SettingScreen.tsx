import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { RootStackNavigationProp } from '../RootStack';
import {
  CommonText,
  Divider,
  IconHeader,
  SafeAreaContainer,
} from '../../components';
import { SettingEntity } from '../../../types';

function SettingScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const settings = useMemo(
    () => [
      { id: 1, title: '테마설정' },
      { id: 2, title: '이용약관' },
      { id: 3, title: '개인정보보호' },
      { id: 4, title: '앱 비밀번호 설정' },
    ],
    []
  );

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const keyExtractor = useCallback((item: SettingEntity) => `${item.id}`, []);

  const onPress = useCallback(
    ({ title }: SettingEntity) =>
      () => {
        if (title === settings[0].title) {
          navigation.navigate('Theme');
        }
      },
    [navigation, settings]
  );

  const renderItem = useCallback<ListRenderItem<SettingEntity>>(
    ({ item }) => (
      <Pressable onPress={onPress(item)}>
        <CommonText
          text={item.title}
          fontSize={16}
          marginBottom={8}
          marginTop={8}
          marginLeft={20}
        />
      </Pressable>
    ),
    [onPress]
  );

  const divider = useCallback(() => <Divider />, []);

  return (
    <SafeAreaContainer>
      <IconHeader title="세팅" isBackButton onPress={onBackPress} />

      <FlatList
        data={settings}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={divider}
      />
    </SafeAreaContainer>
  );
}

export default memo(SettingScreen);
