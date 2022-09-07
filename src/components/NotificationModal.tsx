import React, { memo } from 'react';
import { GestureResponderEvent, Modal } from 'react-native';
import styled from '@emotion/native';

import Divider from './Divider';
import CommonText from './CommonText';

const Container = styled.Pressable({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 30,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
});

const TextContainer = styled.View(({ theme }) => ({
  width: '100%',
  paddingVertical: 25,
  paddingHorizontal: 30,
  justifyContent: 'center',
  alignItems: 'center',
  borderTopEndRadius: 20,
  borderTopLeftRadius: 20,
  backgroundColor: theme.color.card,
}));

const ButtonContainer = styled.View(({ theme }) => ({
  width: '100%',
  flexDirection: 'row',
  borderBottomEndRadius: 20,
  borderBottomLeftRadius: 20,
  backgroundColor: theme.color.card,
}));

const StyledButton = styled.Pressable(() => ({
  flex: 1,
  paddingVertical: 15,
  paddingHorizontal: 25,
  justifyContent: 'center',
  alignItems: 'center',
}));

const ModalText = styled.Text(({ theme }) => ({
  includeFontPadding: false,
  textAlign: 'center',
  fontSize: 15,
  color: theme.color.text,
}));

const ErrorText = styled.Text(({ theme }) => ({
  textAlign: 'center',
  fontSize: 13,
  color: theme.color.red,
}));

interface INotificationModal {
  isOpen: boolean;
  notification: string;
  onNegative: () => void;
  onPostive: (event: GestureResponderEvent) => void;
  error?: boolean;
}

function NotificationModal({
  isOpen,
  notification,
  onNegative,
  onPostive,
  error,
}: INotificationModal) {
  return (
    <Modal
      transparent
      visible={isOpen}
      onDismiss={onNegative}
      animationType="fade"
    >
      <Container onPress={onNegative}>
        <TextContainer>
          <ModalText>{notification}</ModalText>
          {error ? (
            <ErrorText>비밀번호 4자리, 제목을 입력해주세요</ErrorText>
          ) : null}
        </TextContainer>

        <Divider />

        <ButtonContainer>
          <StyledButton onPress={onNegative}>
            <CommonText fontSize={14} text="아니요" />
          </StyledButton>

          <Divider isVertical />

          <StyledButton onPress={onPostive}>
            <CommonText fontSize={14} text="예" />
          </StyledButton>
        </ButtonContainer>
      </Container>
    </Modal>
  );
}

NotificationModal.defaultProps = {
  error: false,
};

export default memo(NotificationModal);
