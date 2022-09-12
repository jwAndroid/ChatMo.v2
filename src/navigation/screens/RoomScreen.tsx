import React, { memo, useCallback, useState } from 'react';
import styled from '@emotion/native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconHeader, SafeAreaContainer } from '../../components';
import useStack from '../../hooks/useStack';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.color.background,
}));

function RoomScreen() {
  const { bottom } = useSafeAreaInsets();

  const { prevRouteName, navigation, roomParams } = useStack();

  console.log(JSON.stringify(roomParams.params, null, 5));

  const [messages, setMessages] = useState<IMessage[]>([
    {
      _id: 1,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'React Native',
      },
    },
  ]);

  const onBackPress = useCallback(() => {
    console.log('onback');
    if (prevRouteName === 'Pin') {
      navigation.popToTop();
    } else if (prevRouteName === 'Search') {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  }, [navigation, prevRouteName]);

  const onSend = useCallback((messages: IMessage[]) => {
    setMessages((prev) => GiftedChat.append(prev, messages));
  }, []);

  return (
    <Container>
      <IconHeader isBackword isIosTopInset onPress={onBackPress} />

      <SafeAreaContainer>
        <GiftedChat
          messages={messages}
          wrapInSafeArea={false}
          alignTop
          alwaysShowSend
          showUserAvatar={false}
          bottomOffset={bottom === 0 ? 0 : bottom}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </SafeAreaContainer>
    </Container>
  );
}

export default memo(RoomScreen);
