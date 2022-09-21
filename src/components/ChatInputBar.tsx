import React, { memo, ReactNode, useCallback } from 'react';
import {
  ComposerProps,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  SendProps,
} from 'react-native-gifted-chat';

import ChatInput from './ChatInput';
import SendButton from './SendButton';
import ActionButton from './ActionButton';
import { ChatInputBarStyles } from '../utils/styles';

interface IChatInputBar {
  props: Readonly<InputToolbarProps<IMessage>>;
}
function ChatInputBar({ props }: IChatInputBar) {
  const { PrimaryStyle, ContainerStyle } = ChatInputBarStyles();

  const renderComposer = useCallback(
    (props: Readonly<ComposerProps> & Readonly<{ children?: ReactNode }>) => (
      <ChatInput props={props} />
    ),
    []
  );

  const renderSend = useCallback(
    (
      props: Readonly<SendProps<IMessage>> & Readonly<{ children?: ReactNode }>
    ) => <SendButton props={props} />,
    []
  );

  const onPress = useCallback(() => {
    console.log('onPress');
  }, []);

  const renderActions = useCallback(
    () => <ActionButton onPress={onPress} />,
    [onPress]
  );

  return (
    <InputToolbar
      {...props}
      primaryStyle={PrimaryStyle}
      renderActions={renderActions}
      containerStyle={ContainerStyle}
      renderComposer={renderComposer}
      renderSend={renderSend}
    />
  );
}

export default memo(ChatInputBar);
