import React, { memo } from 'react';
import { Platform } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const ShadowContainer = styled.View(({ theme }) => {
  const shadow = Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 1,
    },
    android: {
      elevation: 5,
    },
  });

  return {
    position: 'absolute',
    bottom: 60,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: theme.color.sky_300,
    ...shadow,
  };
});

const Container = styled.Pressable({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

const Icon = styled.Image(({ theme }) => ({
  width: 22,
  height: 22,
  tintColor: theme.color.white,
}));

interface IFloatingButton {
  onPress: () => void;
}

function FloatingButton({ onPress }: IFloatingButton) {
  const theme = useTheme();

  return (
    <ShadowContainer>
      <Container onPress={onPress}>
        <Icon source={theme.icon.edit} />
      </Container>
    </ShadowContainer>
  );
}

export default memo(FloatingButton);
