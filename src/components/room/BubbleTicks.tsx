import React, { memo } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const Container = styled.View(() => ({
  paddingLeft: 2,
}));

const Tick = styled.Image(({ theme }) => ({
  width: 8,
  height: 8,
  marginBottom: 0.6,
  tintColor: theme.color.white,
}));

function BubbleTicks() {
  const theme = useTheme();

  return (
    <Container>
      <Tick source={theme.icon.check_circle} />
    </Container>
  );
}

export default memo(BubbleTicks);
