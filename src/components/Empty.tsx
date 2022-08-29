import React from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import CommonText from './CommonText';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: 70,
  backgroundColor: theme.color.background,
}));

const Icon = styled.Image(({ theme }) => ({
  width: 200,
  height: 200,
  tintColor: theme.color.icon,
}));

function Empty() {
  const theme = useTheme();

  return (
    <Container>
      <Icon source={theme.icon.empty} />

      <CommonText text="No Data" fontSize={25} marginTop={10} />
    </Container>
  );
}

export default Empty;
