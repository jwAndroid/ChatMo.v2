import React, { memo, useCallback, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import styled from '@emotion/native';

import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
// import { RootState } from '../../redux/rootReducer';
import { IconHeader } from '../../components';

const Container = styled.View(() => ({
  flex: 1,
}));

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Room'>;

function RoomScreen() {
  // const user = useSelector((state: RootState) => state.auth.user);

  const navigation = useNavigation<RootStackNavigationProp>();

  const { params } = useRoute<RoomScreenRouteProp>();
  // console.log(params);

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onSend = useCallback((messages: IMessage[]) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <Container>
      <IconHeader isBackButton onPress={onBackPress} />

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </Container>
  );
}

export default memo(RoomScreen);
