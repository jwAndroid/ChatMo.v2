import React, { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import * as SystemUI from 'expo-system-ui';
import styled from '@emotion/native';

import { changeTheme } from '../../redux/system/slice';
import { RootState } from '../../redux/rootReducer';
import themeStorage from '../../storages/themeStorage';
import {
  CommonText,
  IconHeader,
  SafeAreaContainer,
  SettingSwitch,
} from '../../components';
import { RootStackNavigationProp } from '../RootStack';

const Container = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 10,
}));

function ThemeScreen() {
  const dispatch = useDispatch();

  const systemTheme = useSelector((state: RootState) => state.system.isDark);

  const [isDark, setIsDark] = useState(systemTheme);

  const navigation = useNavigation<RootStackNavigationProp>();

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
      <IconHeader isLeftIcon onPress={onBackPress} />

      <Container>
        <CommonText text={isDark ? '화이트 테마' : '다크 테마'} fontSize={16} />

        <SettingSwitch onValueChange={onValueChange} isEnabled={isDark} />
      </Container>
    </SafeAreaContainer>
  );
}

export default memo(ThemeScreen);
