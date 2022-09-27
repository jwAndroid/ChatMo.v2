import React, { memo, ReactNode, useMemo } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { IMessage, MessageTextProps } from 'react-native-gifted-chat';

import { regexUrl } from '../utils/text';
import LinkPreviewer from './LinkPreviewer';
import StyledText from './StyledText';

const Container = styled.View(() => ({
  paddingVertical: 3,
  alignItems: 'flex-end',
}));

interface IBubbleText {
  messageText: MessageTextProps<IMessage> & Readonly<{ children?: ReactNode }>;
}
function BubbleText({ messageText }: IBubbleText) {
  const theme = useTheme();

  const message = useMemo(() => {
    if (messageText.currentMessage) {
      return messageText.currentMessage.text;
    }

    return '';
  }, [messageText.currentMessage]);

  return (
    <Container>
      {regexUrl(message ?? '') ? (
        <LinkPreviewer url={message} />
      ) : (
        <StyledText
          text={message}
          specificColor={theme.color.white}
          fontSize={14}
        />
      )}
    </Container>
  );
}

export default memo(BubbleText);
