import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import styled from '@emotion/native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import { useAppSelector } from '../../hooks/useRedux';
import { loadRoom } from '../../firebase/room';
import { createMessage } from '../../firebase/posts';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { IconHeader, SafeAreaContainer } from '../../components';
import { getTimestamp } from '../../utils/date';
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

  const [messages, setMessages] = useState<IMessage[] | undefined>([]);

  const me = useMemo(() => {
    if (user) {
      return {
        _id: user.userId,
      };
    }
  }, [user]);

  useLayoutEffect(() => {
    (async () => {
      if (user && params) {
        const chats = await loadRoom(user.userId, params.roomId);

        if (chats) {
          setMessages(chats);
        }
      }
    })();
  }, [user, params]);

  useBackEffect();

  const onBackPress = useCallback(() => {
    const routes = navigation.getState()?.routes;
    const prev = routes[routes.length - 2].name;

    if (prev === 'Pin') {
      navigation.popToTop();
    } else if (prev === 'Search') {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  }, [navigation]);

  const onSend = useCallback(
    (messages: IMessage[]) => {
      if (user && params) {
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
