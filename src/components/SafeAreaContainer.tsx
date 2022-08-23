import React, { memo } from 'react';
import styled from '@emotion/native';

const Container = styled.SafeAreaView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.color.background,
}));

interface ISafeAreaContainer {
  children: React.ReactNode;
}

function SafeAreaContainer({ children }: ISafeAreaContainer) {
  return <Container>{children}</Container>;
}

export default memo(SafeAreaContainer);
