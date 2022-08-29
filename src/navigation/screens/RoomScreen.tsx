import React, { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';

import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { IconHeader, SafeAreaContainer } from '../../components';
import { RootState } from '../../redux/rootReducer';
import { fulfilled } from '../../redux/posts/slice';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.color.background,
}));

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Room'>;

function RoomScreen() {
  const dispatch = useDispatch();

  const posts = useSelector((state: RootState) => state.posts.posts);

  const { bottom } = useSafeAreaInsets();

  const { params } = useRoute<RoomScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();

  console.log(JSON.stringify(params, null, 5));

  const onPressTest = useCallback(() => {
    if (posts.data) {
      dispatch(
        fulfilled([
          {
            id: '1',
            text: 'testredux',
            renderDay: 'testday',
            createdAt: 1,
            type: 'dasd',
          },
          ...posts.data,
        ])
      );
    }
  }, [dispatch, posts.data]);

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
    navigation.goBack();
  }, [navigation]);

  const onSend = useCallback((messages: IMessage[]) => {
    setMessages((prev) => GiftedChat.append(prev, messages));
  }, []);

  return (
    <Container>
      <IconHeader isLeftIcon isIosTopInset onPress={onBackPress} />

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
