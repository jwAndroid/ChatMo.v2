import React, { memo, useCallback, useEffect } from 'react';
import { Modal } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import StyledText from '../StyledText';

const Container = styled.Pressable({
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: 30,
});

const ToastBlock = styled.View(({ theme }) => ({
  paddingHorizontal: 30,
  paddingVertical: 10,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 15,
  backgroundColor: theme.color.shadow,
}));

interface IToastModal {
  text: string;
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
}
function ToastModal({ text, showToast, setShowToast }: IToastModal) {
  const theme = useTheme();

  useEffect(() => {
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  }, [setShowToast]);

  const onPress = useCallback(() => {
    setShowToast(false);
  }, [setShowToast]);

  return (
    <Modal transparent visible={showToast} animationType="slide">
      <Container onPress={onPress}>
        <ToastBlock>
          <StyledText
            text={text}
            specificColor={theme.color.white}
            fontSize={12}
          />
        </ToastBlock>
      </Container>
    </Modal>
  );
}

export default memo(ToastModal);
