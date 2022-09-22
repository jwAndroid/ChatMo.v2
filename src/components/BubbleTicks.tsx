import React, { memo } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const Container = styled.View(() => ({
  marginLeft: 3,
  marginRight: -3,
  justifyContent: 'center',
  alignItems: 'center',
}));

const Tick = styled.Image(({ theme }) => ({
  width: 15,
  height: 15,
  marginBottom: 1.5,
  tintColor: theme.color.red,
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
