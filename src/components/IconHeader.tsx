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
    paddingHorizontal: 15,
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
  isLeftIcon?: boolean;
  isRightIcon?: boolean;
  isIosTopInset?: boolean;
  onPress: () => void;
}

function IconHeader({
  title,
  isLeftIcon,
  isRightIcon,
  isIosTopInset,
  onPress,
}: IIconHeader) {
  const theme = useTheme();

  return (
    <HeaderContainer isIosTopInset={isIosTopInset}>
      <Container>
        {isLeftIcon && (
          <Pressable onPress={onPress} hitSlop={10}>
            <Icon source={theme.icon.backward} />
          </Pressable>
        )}

        <CommonText fontSize={20} text={title} marginLeft={3} />
      </Container>

      {isRightIcon && (
        <Pressable onPress={onPress} hitSlop={10}>
          <Icon source={theme.icon.settings} />
        </Pressable>
      )}
    </HeaderContainer>
  );
}

IconHeader.defaultProps = {
  title: '',
  isLeftIcon: false,
  isRightIcon: false,
  isIosTopInset: false,
};

export default memo(IconHeader);
