import React, { memo, ReactNode, useCallback, useMemo } from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@emotion/react';
import {
  ComposerProps,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  SendProps,
} from 'react-native-gifted-chat';

import ChatInput from './ChatInput';
import { SendButton } from '../button';

interface IChatInputBar {
  props: Readonly<InputToolbarProps<IMessage>>;
}
function ChatInputBar({ props }: IChatInputBar) {
  const theme = useTheme();

  const PrimaryStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? undefined : 7,
      paddingBottom: Platform.OS === 'ios' ? undefined : 3,
      paddingLeft: 10,
      paddingRight: 15,
      backgroundColor: theme.color.background,
    }),
    [theme]
  );

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

  return (
    <InputToolbar
      {...props}
      primaryStyle={PrimaryStyle}
      renderComposer={renderComposer}
      renderSend={renderSend}
    />
  );
}

export default memo(ChatInputBar);
