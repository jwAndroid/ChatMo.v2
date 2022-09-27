import React, { memo } from 'react';
import { Platform, Pressable } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import CommonText from './CommonText';

const Container = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));
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

const IconContainer = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));
interface IIcon {
  size?: number;
  marginRight?: number;
}
const Icon = styled.Image<IIcon>(({ theme, size = 20, marginRight = 0 }) => ({
  width: size,
  height: size,
  marginRight,
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
  isSearch?: boolean;
  onPressSearch?: () => void;
}

function IconHeader({
  title,
  isBackword,
  isSettings,
  isIosTopInset,
  isCheck,
  onPress,
  onPressCheck,
  isSearch,
  onPressSearch,
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

      <IconContainer>
        {isSearch && (
          <Pressable onPress={onPressSearch} hitSlop={10}>
            <Icon marginRight={15} source={theme.icon.search} size={18} />
          </Pressable>
        )}

        {isSettings && (
          <Pressable onPress={onPress} hitSlop={10}>
            <Icon source={theme.icon.setting} />
          </Pressable>
        )}

        {isCheck && (
          <Pressable onPress={onPressCheck} hitSlop={10}>
            <Icon source={theme.icon.check_circle} />
          </Pressable>
        )}
      </IconContainer>
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
  isSearch: false,
  onPressSearch: null,
};

export default memo(IconHeader);
