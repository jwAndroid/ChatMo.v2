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

import ActionButton from './ActionButton';
import ChatInput from './ChatInput';
import SendButton from './SendButton';

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
      renderComposer={renderComposer}
      renderSend={renderSend}
    />
  );
}

export default memo(ChatInputBar);
