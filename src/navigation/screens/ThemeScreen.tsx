import React, { memo, useCallback, useState } from 'react';
import styled from '@emotion/native';
import { useNavigation } from '@react-navigation/core';

import { RootStackNavigationProp } from '../RootStack';
import {
  CommonText,
  IconHeader,
  SafeAreaContainer,
  SettingSwitch,
} from '../../components';

const Container = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 10,
}));

function ThemeScreen() {
  const [isEnabled, setIsEnabled] = useState(false);

  const navigation = useNavigation<RootStackNavigationProp>();

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onValueChange = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  return (
    <SafeAreaContainer>
      <IconHeader isBackButton onPress={onBackPress} />

      <Container>
        <CommonText
          text={isEnabled ? '다크 테마' : '화이트 테마'}
          fontSize={16}
        />

        <SettingSwitch onValueChange={onValueChange} isEnabled={isEnabled} />
      </Container>
    </SafeAreaContainer>
  );
}

export default memo(ThemeScreen);
