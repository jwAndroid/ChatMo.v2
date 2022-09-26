import React, { memo } from 'react';
import { Modal, ActivityIndicator } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const Container = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
});

interface ILoadingModal {
  isOpen: boolean;
}
function LoadingModal({ isOpen }: ILoadingModal) {
  const theme = useTheme();

  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <Container>
        <ActivityIndicator size="large" color={theme.color.chip} />
      </Container>
    </Modal>
  );
}

export default memo(LoadingModal);
