import React, { memo, useEffect } from 'react';
import { Modal } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { CommonText } from '../text';

const Container = styled.Pressable({
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: 30,
});

const Toast = styled.View(({ theme }) => ({
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

  return (
    <Modal transparent visible={showToast} animationType="slide">
      <Container onPress={() => setShowToast(false)}>
        <Toast>
          <CommonText
            text={text}
            isSpecificColor
            specificColor={theme.color.white}
            fontSize={12}
          />
        </Toast>
      </Container>
    </Modal>
  );
}

export default memo(ToastModal);
