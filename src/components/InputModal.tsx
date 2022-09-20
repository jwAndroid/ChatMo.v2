import React, { memo } from 'react';
import { GestureResponderEvent, Modal } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import Divider from './Divider';
import CommonText from './CommonText';

const Container = styled.Pressable({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 30,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

const ContentContainer = styled.View(({ theme }) => ({
  width: '100%',
  paddingVertical: 20,
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

const StyledInput = styled.TextInput(({ theme }) => ({
  borderWidth: 1,
  fontSize: 13,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 5,
  borderRadius: 13,
  marginBottom: 5,
  color: theme.color.text,
  borderColor: theme.color.chip,
}));

interface IInputModal {
  isOpen: boolean;
  onNegative: () => void;
  onPostive: (event: GestureResponderEvent) => void;
  value: string;
  onChangeText: (text: string) => void;
}
function InputModal({
  isOpen,
  onNegative,
  onPostive,
  value,
  onChangeText,
}: IInputModal) {
  const theme = useTheme();

  return (
    <Modal
      transparent
      visible={isOpen}
      onDismiss={onNegative}
      animationType="fade"
    >
      <Container onPress={onNegative}>
        <ContentContainer>
          <CommonText
            fontSize={13}
            text="속성 추가"
            isSpecificColor
            specificColor={theme.color.shadow}
            marginBottom={10}
          />

          <StyledInput
            value={value}
            placeholder="제목 입력.."
            placeholderTextColor={theme.color.shadow}
            onChangeText={onChangeText}
            maxLength={15}
          />

          {value.length >= 15 ? (
            <CommonText
              fontSize={12}
              text="제목은 15자 까지 입력 가능 합니다."
              isSpecificColor
              specificColor={theme.color.shadow}
              marginTop={5}
            />
          ) : null}
        </ContentContainer>

        <Divider />

        <ButtonContainer>
          <StyledButton onPress={onNegative}>
            <CommonText
              fontSize={14}
              text="취소"
              isSpecificColor
              specificColor={theme.color.shadow}
            />
          </StyledButton>

          <Divider isVertical />

          <StyledButton onPress={onPostive}>
            <CommonText
              fontSize={14}
              text="확인"
              isSpecificColor
              specificColor={theme.color.shadow}
            />
          </StyledButton>
        </ButtonContainer>
      </Container>
    </Modal>
  );
}

export default memo(InputModal);
