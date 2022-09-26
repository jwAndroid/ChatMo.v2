import React, { memo, useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import * as SystemUI from 'expo-system-ui';
import styled from '@emotion/native';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { changeTheme } from '../../redux/system/slice';
import themeStorage from '../../storages/themeStorage';
import useBackEffect from '../../hooks/useBackEffect';
import { RootStackNavigationProp } from '../RootStack';
import { CommonText, IconHeader, SafeAreaContainer } from '../../components';
import { SettingSwitch } from '../../components/button';

const Container = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 10,
}));

function ThemeScreen() {
  const dispatch = useAppDispatch();

  const systemTheme = useAppSelector((state) => state.system.isDark);

  const [isDark, setIsDark] = useState(systemTheme);

  const navigation = useNavigation<RootStackNavigationProp>();

  useBackEffect();

  const onBackPress = useCallback(() => {
    themeStorage.set(isDark.toString());

    navigation.goBack();
  }, [navigation, isDark]);

  const onValueChange = useCallback(async () => {
    if (isDark) {
      setIsDark(false);

      dispatch(changeTheme({ isDark: false }));

      await SystemUI.setBackgroundColorAsync('#ffffff');
    } else {
      setIsDark(true);

      dispatch(changeTheme({ isDark: true }));

      await SystemUI.setBackgroundColorAsync('#000000');
    }
  }, [dispatch, setIsDark, isDark]);

  return (
    <SafeAreaContainer>
      <IconHeader isBackword onPress={onBackPress} />

      <Container>
        <CommonText text={isDark ? '화이트 테마' : '다크 테마'} fontSize={16} />

        <SettingSwitch onValueChange={onValueChange} isEnabled={isDark} />
      </Container>
    </SafeAreaContainer>
  );
}

export default memo(ThemeScreen);
