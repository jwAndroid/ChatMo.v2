import React, { memo } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import CommonText from '../CommonText';

const Container = styled.View(() => ({
  position: 'relative',
  alignItems: 'center',
  marginTop: 10,
}));

const Icon = styled.Image(({ theme }) => ({
  width: 30,
  height: 30,
  tintColor: theme.color.icon,
}));

function EmptyContainer() {
  const theme = useTheme();

  return (
    <Container>
      <Icon source={theme.icon.warning_sign} />

      <CommonText
        text="데이터가 존재하지 않습니다."
        fontSize={16}
        marginTop={10}
      />
    </Container>
  );
}

export default memo(EmptyContainer);
