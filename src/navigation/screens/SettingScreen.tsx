import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, StyleProp, ViewStyle } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useNavigation } from '@react-navigation/core';

import { RootStackNavigationProp } from '../RootStack';
import useBackEffect from '../../hooks/useBackEffect';
import { SettingEntity } from '../../../types';
import { CommonText, Divider, IconHeader } from '../../components';
import { SafeAreaContainer } from '../../components/layout';

const StyledPressable = styled.Pressable(() => ({
  paddingHorizontal: 20,
  paddingVertical: 10,
}));

const VersionContainer = styled.View(() => ({
  alignItems: 'center',
}));

function SettingScreen() {
  const theme = useTheme();

  const navigation = useNavigation<RootStackNavigationProp>();

  const settings = useMemo(
    () => [
      { id: 1, title: '테마설정' },
      { id: 2, title: '이용약관' },
      { id: 3, title: '개인정보보호' },
    ],
    []
  );

  const style = useMemo<StyleProp<ViewStyle>>(
    () => ({
      flex: 1,
      paddingTop: 10,
    }),
    []
  );

  useBackEffect();

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
      <StyledPressable onPress={onPress(item)}>
        <CommonText text={item.title} fontSize={16} />
      </StyledPressable>
    ),
    [onPress]
  );

  const divider = useCallback(() => <Divider />, []);

  return (
    <SafeAreaContainer>
      <IconHeader title="세팅" isBackword onPress={onBackPress} />

      <FlatList
        style={style}
        data={settings}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={divider}
      />

      <VersionContainer>
        <CommonText
          text="version: 1.0.0"
          isSpecificColor
          specificColor={theme.color.shadow}
          fontSize={12}
          marginBottom={10}
        />
      </VersionContainer>
    </SafeAreaContainer>
  );
}

export default memo(SettingScreen);
