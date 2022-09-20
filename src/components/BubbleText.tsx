import React, { memo, ReactNode } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { IMessage, MessageTextProps } from 'react-native-gifted-chat';

import CommonText from './CommonText';

const Container = styled.View(() => ({
  paddingVertical: 3,
  alignItems: 'flex-end',
}));

interface IBubbleText {
  messageText: MessageTextProps<IMessage> & Readonly<{ children?: ReactNode }>;
}
function BubbleText({ messageText }: IBubbleText) {
  const theme = useTheme();

  const message = messageText.currentMessage?.text ?? '';

  return (
    <Container>
      <CommonText
        text={message}
        isSpecificColor
        specificColor={theme.color.white}
        fontSize={14}
      />
    </Container>
  );
}

export default memo(BubbleText);
