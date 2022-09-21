import React, { memo } from 'react';
import { GestureResponderEvent, Modal, Platform } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { CommonText } from '../text';
import { ModalEntity } from '../../../types';

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

interface IActionsModal {
  items: ModalEntity[];
  isOpen: boolean;
  onNegative: () => void;
  onPressFirst: (event: GestureResponderEvent) => void;
  onPressSecond: (event: GestureResponderEvent) => void;
}

function ActionsModal({
  items,
  isOpen,
  onNegative,
  onPressFirst,
  onPressSecond,
}: IActionsModal) {
  const theme = useTheme();

  return (
    <Modal
      transparent
      visible={isOpen}
      onDismiss={onNegative}
      animationType="slide"
    >
      <Container onPress={onNegative}>
        <ShadowButton onPress={onPressFirst}>
          <CommonText text={items[0].text} fontSize={14} />
        </ShadowButton>

        <ShadowButton onPress={onPressSecond}>
          <CommonText text={items[1].text} fontSize={14} />
        </ShadowButton>

        <ShadowButton onPress={onNegative} marginTop={20}>
          <CommonText
            text={items[2].text}
            fontSize={14}
            isSpecificColor
            specificColor={theme.color.red}
          />
        </ShadowButton>
      </Container>
    </Modal>
  );
}

export default memo(ActionsModal);
