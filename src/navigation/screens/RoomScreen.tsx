import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import styled from '@emotion/native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import { useAppSelector } from '../../hooks/useRedux';
import { createMessage } from '../../firebase/posts';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { IconHeader, SafeAreaContainer } from '../../components';
import { getTimestamp } from '../../utils/date';
import { firestore } from '../../firebase/config';
import useBackEffect from '../../hooks/useBackEffect';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.color.background,
}));

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Pin'>;

function RoomScreen() {
  const user = useAppSelector((state) => state.auth.user);

  const { bottom } = useSafeAreaInsets();

  const navigation = useNavigation<RootStackNavigationProp>();

  const { params } = useRoute<RoomScreenRouteProp>();

  const [messages, setMessages] = useState<IMessage[]>([]);

  const me = useMemo(
    () => ({
      _id: user!!.userId,
    }),
    [user]
  );

  useBackEffect();

  useLayoutEffect(() => {
    if (user && params && params !== undefined) {
      const ref = query(
        collection(
          firestore,
          'posts',
          'users',
          user.userId,
          'rooms',
          'room',
          params?.roomId,
          'messages'
        ),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(ref, (snopshot) => {
        const prepared = snopshot.docs.map((doc) => doc.data() as IMessage);

        setMessages(prepared);
        // TODO: dispatch message
      });

      return () => unsubscribe();
    }
  }, [user, params]);

  const onBackPress = useCallback(() => {
    const routes = navigation.getState()?.routes;
    const prevRouteName = routes[routes.length - 2].name;

    if (prevRouteName === 'Pin') {
      navigation.popToTop();
    } else if (prevRouteName === 'Search') {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  }, [navigation]);

  const onSend = useCallback(
    (messages: IMessage[]) => {
      if (user && params && params !== undefined) {
        const message = {
          _id: uuid.v4().toString(),
          text: messages[0].text,
          createdAt: getTimestamp(),
          user: {
            _id: user.userId,
          },
        };

        createMessage(user.userId, params.roomId, message);

        setMessages((prev) => GiftedChat.append(prev, messages));
      }
    },
    [user, params]
  );

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
          user={me}
        />
      </SafeAreaContainer>
    </Container>
  );
}

export default memo(RoomScreen);
