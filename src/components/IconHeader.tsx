import React, { memo } from 'react';
import { Platform, Pressable } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import CommonText from './CommonText';

interface IHeaderContainer {
  isIosTopInset?: boolean;
}

const HeaderContainer = styled.View<IHeaderContainer>(
  ({ theme, isIosTopInset }) => ({
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.select({
      android: getStatusBarHeight(),
      ios: isIosTopInset ? getStatusBarHeight() : 0,
    }),
    backgroundColor: theme.color.background,
  })
);

const Container = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

const Icon = styled.Image(({ theme }) => ({
  width: 22,
  height: 22,
  tintColor: theme.color.icon,
}));

interface IIconHeader {
  title?: string;
  isBackword?: boolean;
  isSettings?: boolean;
  isIosTopInset?: boolean;
  isCheck?: boolean;
  onPress: () => void;
  onPressCheck?: () => void;
}

function IconHeader({
  title,
  isBackword,
  isSettings,
  isIosTopInset,
  isCheck,
  onPress,
  onPressCheck,
}: IIconHeader) {
  const theme = useTheme();

  return (
    <HeaderContainer isIosTopInset={isIosTopInset}>
      <Container>
        {isBackword && (
          <Pressable onPress={onPress} hitSlop={10}>
            <Icon source={theme.icon.backward} />
          </Pressable>
        )}

        <CommonText fontSize={20} text={title} marginLeft={3} />
      </Container>

      {isSettings && (
        <Pressable onPress={onPress} hitSlop={10}>
          <Icon source={theme.icon.settings} />
        </Pressable>
      )}

      {isCheck && (
        <Pressable onPress={onPressCheck} hitSlop={10}>
          <Icon source={theme.icon.check_circle} />
        </Pressable>
      )}
    </HeaderContainer>
  );
}

IconHeader.defaultProps = {
  title: '',
  isBackword: false,
  isSettings: false,
  isCheck: false,
  isIosTopInset: false,
  onPressCheck: null,
};

export default memo(IconHeader);
