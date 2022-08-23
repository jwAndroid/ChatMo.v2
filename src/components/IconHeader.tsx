import React, { memo } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Pressable } from 'react-native';
import CommonText from './CommonText';

const HeaderContainer = styled.View(({ theme }) => ({
  height: 50,
  flexDirection: 'row',
  paddingHorizontal: 15,
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.color.header,
}));

const Container = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

const Icon = styled.Image(({ theme }) => ({
  width: 25,
  height: 25,
  tintColor: theme.color.icon,
}));

interface IIconHeader {
  title: string;
  isBackButton?: boolean;
  onPress: () => void;
}

function IconHeader({ title, isBackButton, onPress }: IIconHeader) {
  const theme = useTheme();

  return (
    <HeaderContainer>
      <Container>
        {isBackButton && (
          <Pressable onPress={onPress} hitSlop={10}>
            <Icon source={theme.icon.backward} />
          </Pressable>
        )}

        <CommonText fontSize={20} text={title} marginLeft={3} />
      </Container>

      {!isBackButton && (
        <Pressable onPress={onPress} hitSlop={10}>
          <Icon source={theme.icon.settings} />
        </Pressable>
      )}
    </HeaderContainer>
  );
}

IconHeader.defaultProps = {
  isBackButton: false,
};

export default memo(IconHeader);
