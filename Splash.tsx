import React, { memo } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.color.background,
}));

const Logo = styled.Image(({ theme }) => ({
  width: 200,
  resizeMode: 'contain',
  tintColor: theme.color.icon,
}));

function Splash() {
  const theme = useTheme();

  return (
    <Container>
      <Logo source={theme.image.splash} />
    </Container>
  );
}

export default memo(Splash);
