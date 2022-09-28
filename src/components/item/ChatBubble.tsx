import React, { memo, ReactNode, useCallback } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import {
  Bubble,
  BubbleProps,
  IMessage,
  MessageTextProps,
  Time,
  TimeProps,
} from 'react-native-gifted-chat';

import BubbleText from './BubbleText';
import { ChatBubbleStyle } from '../../utils/styles';

const Container = styled.View(() => ({
  marginLeft: 3,
  marginRight: -3,
  justifyContent: 'center',
  alignItems: 'center',
}));

const Tick = styled.Image(({ theme }) => ({
  width: 15,
  height: 15,
  marginBottom: 1.5,
  tintColor: theme.color.black,
}));

interface IChatBubble {
  props: Readonly<BubbleProps<IMessage>> & Readonly<{ children?: ReactNode }>;
  onPressBubble: (context?: any, message?: any) => void;
  onLongPressBubble: (context?: any, message?: any) => void;
}
function ChatBubble({ props, onPressBubble, onLongPressBubble }: IChatBubble) {
  const theme = useTheme();

  const {
    BottomContainerStyle,
    ContainerStyle,
    TimeContainerStyle,
    TimeTextStyle,
    WrapperStyle,
    NextStyle,
    PreviousStyle,
  } = ChatBubbleStyle();

  const renderTime = useCallback(
    (
      props: Readonly<TimeProps<IMessage>> & Readonly<{ children?: ReactNode }>
    ) => (
      <Time
        {...props}
        containerStyle={TimeContainerStyle}
        timeTextStyle={TimeTextStyle}
      />
    ),
    [TimeTextStyle, TimeContainerStyle]
  );

  const renderTicks = useCallback(
    (currentMessage: IMessage & Readonly<{ children?: ReactNode }>) =>
      currentMessage.received && (
        <Container>
          <Tick source={theme.icon.check} />
        </Container>
      ),
    [theme.icon.check]
  );

  const renderMessageText = useCallback(
    (
      messageText: MessageTextProps<IMessage> &
        Readonly<{ children?: ReactNode }>
    ) => <BubbleText messageText={messageText} />,
    []
  );

  return (
    <Bubble
      {...props}
      containerStyle={ContainerStyle}
      wrapperStyle={WrapperStyle}
      bottomContainerStyle={BottomContainerStyle}
      containerToPreviousStyle={PreviousStyle}
      containerToNextStyle={NextStyle}
      renderTicks={renderTicks}
      renderTime={renderTime}
      renderMessageText={renderMessageText}
      onLongPress={onLongPressBubble}
      onPress={onPressBubble}
    />
  );
}

export default memo(ChatBubble);
