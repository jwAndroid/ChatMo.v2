import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const { height } = Dimensions.get('screen');

const Container = styled.View(() => ({
  height: height / 1.5,
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Icon = styled.Image(({ theme }) => ({
  width: 200,
  height: 200,
  tintColor: theme.color.icon,
}));

function EmptyContainer() {
  const theme = useTheme();

  return (
    <Container>
      <Icon source={theme.icon.empty} />
    </Container>
  );
}

export default memo(EmptyContainer);
