import React, { memo } from 'react';
import { GestureResponderEvent, Modal } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import Divider from '../Divider';
import StyledText from '../StyledText';

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
  const theme = useTheme();

  return (
    <Modal
      transparent
      visible={isOpen}
      onDismiss={onNegative}
      animationType="fade"
    >
      <Container onPress={onNegative}>
        <TextContainer>
          <StyledText text={notification} fontSize={14} isTextAlignCenter />

          {error ? (
            <StyledText
              text="비밀번호 4자리 또는 제목을 입력해주세요."
              fontSize={13}
              specificColor={theme.color.red}
              marginTop={3}
            />
          ) : null}
        </TextContainer>

        <Divider />

        <ButtonContainer>
          <StyledButton onPress={onNegative}>
            <StyledText fontSize={14} text="아니요" />
          </StyledButton>

          <Divider isVertical />

          <StyledButton onPress={onPostive}>
            <StyledText fontSize={14} text="예" />
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
