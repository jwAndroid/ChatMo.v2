import React, { memo } from 'react';
import { GestureResponderEvent, Modal, Platform } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { CommonText } from '../text';

const Container = styled.Pressable({
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingBottom: 40,
});

interface IButton {
  marginTop?: number;
}
const ShadowButton = styled.Pressable<IButton>(({ theme, marginTop = 10 }) => {
  const shadow = Platform.select({
    ios: {
      shadowColor: theme.color.shadow,
      shadowOffset: {
        width: 1,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 1,
    },
    android: {
      elevation: 5,
      shadowColor: theme.color.shadow,
    },
  });

  return {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop,
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: theme.color.bar,
    ...shadow,
  };
});

interface IBottomSheetModal {
  isOpen: boolean;
  onNegative: () => void;
  onPostive: (event: GestureResponderEvent) => void;
}

function BottomSheetModal({
  isOpen,
  onNegative,
  onPostive,
}: IBottomSheetModal) {
  const theme = useTheme();

  return (
    <Modal
      transparent
      visible={isOpen}
      onDismiss={onNegative}
      animationType="slide"
    >
      <Container onPress={onNegative}>
        <ShadowButton onPress={onPostive}>
          <CommonText text="카메라" fontSize={15} />
        </ShadowButton>

        <ShadowButton onPress={onNegative}>
          <CommonText text="갤러리" fontSize={15} />
        </ShadowButton>

        <ShadowButton onPress={onNegative} marginTop={20}>
          <CommonText
            text="취소"
            fontSize={15}
            isSpecificColor
            specificColor={theme.color.red}
          />
        </ShadowButton>
      </Container>
    </Modal>
  );
}

export default memo(BottomSheetModal);
