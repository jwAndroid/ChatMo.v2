import React, { memo, ReactNode, useCallback } from 'react';
import {
  Bubble,
  BubbleProps,
  IMessage,
  MessageTextProps,
  Time,
  TimeProps,
} from 'react-native-gifted-chat';

import { ChatBubbleStyle } from '../utils/styles';
import BubbleText from './BubbleText';
import BubbleTicks from './BubbleTicks';

interface IChatBubble {
  props: Readonly<BubbleProps<IMessage>> & Readonly<{ children?: ReactNode }>;
  onPressBubble: (context?: any, message?: any) => void;
  onLongPressBubble: (context?: any, message?: any) => void;
}
function ChatBubble({ props, onPressBubble, onLongPressBubble }: IChatBubble) {
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
      currentMessage.received && <BubbleTicks />,
    []
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
