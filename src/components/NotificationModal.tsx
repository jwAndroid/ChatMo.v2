import React, { memo, useMemo } from 'react';
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
  fontSize: 14,
  color: theme.color.text,
}));

interface INotificationModal {
  isOpen: boolean;
  onNegative: () => void;
  onPostive: (event: GestureResponderEvent) => void;
}

function NotificationModal({
  isOpen,
  onNegative,
  onPostive,
}: INotificationModal) {
  const notification = useMemo(
    () =>
      '삭제 하시겠습니까?\n삭제를 하면 내용이 모두 삭제되고\n목록에서도 삭제됩니다.',
    []
  );

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
        </TextContainer>

        <Divider />

        <ButtonContainer>
          <StyledButton onPress={onNegative}>
            <CommonText fontSize={17} text="아니요" />
          </StyledButton>

          <Divider isVertical />

          <StyledButton onPress={onPostive}>
            <CommonText fontSize={17} text="예" />
          </StyledButton>
        </ButtonContainer>
      </Container>
    </Modal>
  );
}

export default memo(NotificationModal);
