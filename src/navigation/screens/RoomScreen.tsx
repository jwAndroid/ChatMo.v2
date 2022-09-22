import React, {
  memo,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { ActivityIndicator } from 'react-native';
import styled from '@emotion/native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import {
  BubbleProps,
  DayProps,
  GiftedChat,
  InputToolbarProps,
} from 'react-native-gifted-chat';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fulfilled } from '../../redux/posts/slice';
import { fulfilledChat } from '../../redux/chat/slice';
import { createMessage, onModifyRoom } from '../../firebase/posts';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import useBackEffect from '../../hooks/useBackEffect';
import { getTimestamp } from '../../utils/date';
import { actionsModal, bubbleModal } from '../../utils/constants';
import { MessageEntity } from '../../../types';
import {
  deleteMessage,
  loadMessages,
  onModifyMessage,
} from '../../firebase/room';
import {
  ActionButton,
  ActionsModal,
  ChatBubble,
  ChatInputBar,
  DayHeader,
  IconHeader,
  SafeAreaContainer,
} from '../../components';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.color.background,
}));

const LoadingContainer = styled.View(() => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}));

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Pin'>;

function RoomScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);
  const chat = useAppSelector((state) => state.chat.chat);

  const navigation = useNavigation<RootStackNavigationProp>();
  const { params } = useRoute<RoomScreenRouteProp>();

  const { bottom } = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);
  const [isBubblePress, setIsBubblePress] = useState(false);
  const [pickedItem, setPickedItem] = useState<MessageEntity | null>(null);
  const [isReady, setIsReady] = useState(false);

  const userId = useMemo(() => {
    if (user) {
      return {
        _id: user.userId,
      };
    }
  }, [user]);

  useLayoutEffect(() => {
    (async () => {
      setIsReady(false);

      if (user && params) {
        const chats = await loadMessages(user.userId, params.roomId);

        if (chats) {
          dispatch(fulfilledChat(chats));

          setIsReady(true);
        }
      }
    })();
  }, [dispatch, user, params]);

  useBackEffect();

  const onBackPress = useCallback(async () => {
    if (chat.data && chat.data.length > 0 && params && user && posts.data) {
      const prepared = {
        ...params,
        lastMemo: chat.data[0].text,
        memoCount: chat.data.length,
        updatedAt: getTimestamp(),
      };

      const updatedRooms = posts.data.map((post) =>
        post.roomId === params.roomId
          ? {
              ...post,
              ...prepared,
            }
          : post
      );

      dispatch(fulfilled(updatedRooms));

      await onModifyRoom(user.userId, params.roomId, prepared);
    }

    const routes = navigation.getState()?.routes;
    const prev = routes[routes.length - 2].name;

    if (prev === 'Pin') {
      navigation.popToTop();
    } else if (prev === 'Search') {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  }, [dispatch, chat.data, params, user, posts.data, navigation]);

  const onSend = useCallback(
    (messages: MessageEntity[]) => {
      if (
        user &&
        params &&
        messages.length > 0 &&
        messages[0].text.length > 0
      ) {
        const message = {
          _id: uuid.v4().toString(),
          text: messages[0].text,
          createdAt: getTimestamp(),
          received: false,
          image: '',
          user: {
            _id: user.userId,
          },
        };

        createMessage(user.userId, params.roomId, message);

        if (message && chat.data) {
          dispatch(fulfilledChat([message, ...chat.data]));
        }
      }
    },
    [dispatch, chat.data, user, params]
  );

  const renderDay = useCallback(
    (
      props: Readonly<DayProps<MessageEntity>> &
        Readonly<{ children?: ReactNode }>
    ) => <DayHeader props={props} />,
    []
  );

  const onPressBubble = useCallback(
    (_: any, message: MessageEntity) => {
      if (user && params && message && chat.data) {
        const prepared = {
          ...message,
          received: !message.received,
        };

        const filtered = chat.data.map((item) =>
          message._id === item._id ? prepared : item
        );

        dispatch(fulfilledChat(filtered));

        onModifyMessage(user.userId, params, prepared);
      }
    },
    [dispatch, chat.data, user, params]
  );

  const onLongPressBubble = useCallback((_: any, message: MessageEntity) => {
    if (message) {
      setIsBubblePress(true);

      setPickedItem(message);

      setIsOpen(true);
    }
  }, []);

  const renderBubble = useCallback(
    (
      props: Readonly<BubbleProps<MessageEntity>> &
        Readonly<{ children?: ReactNode }>
    ) => (
      <ChatBubble
        props={props}
        onPressBubble={onPressBubble}
        onLongPressBubble={onLongPressBubble}
      />
    ),
    [onPressBubble, onLongPressBubble]
  );

  const renderInputToolbar = useCallback(
    (
      props: Readonly<InputToolbarProps<MessageEntity>> &
        Readonly<{ children?: ReactNode }>
    ) => <ChatInputBar props={props} />,
    []
  );

  const onPressAction = useCallback(() => {
    setIsBubblePress(false);

    setIsOpen(true);
  }, []);

  const renderActions = useCallback(
    () => <ActionButton onPress={onPressAction} />,
    [onPressAction]
  );

  const onPressFirst = useCallback(() => {
    if (isBubblePress) {
      if (chat.data && user && params && pickedItem) {
        const prepared = chat.data.filter(
          (item: MessageEntity) => item._id !== pickedItem._id
        );

        dispatch(fulfilledChat(prepared));

        deleteMessage(user.userId, params, pickedItem);

        setIsOpen(false);

        setPickedItem(null);
      }
    } else {
      console.log('카메라');

      setIsOpen(false);
    }
  }, [dispatch, chat.data, params, user, pickedItem, isBubblePress]);

  const onPressSecond = useCallback(() => {
    if (isBubblePress) {
      setIsOpen(false);
    } else {
      console.log('갤러리');

      setIsOpen(false);
    }
  }, [isBubblePress]);

  const onNegative = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Container>
      <IconHeader isBackword isIosTopInset onPress={onBackPress} />

      <SafeAreaContainer>
        {isReady ? (
          <GiftedChat
            user={userId}
            messages={chat.data}
            onSend={(messages) => onSend(messages)}
            bottomOffset={bottom === 0 ? 0 : bottom - 3}
            wrapInSafeArea={false}
            showUserAvatar={false}
            scrollToBottom
            alignTop
            alwaysShowSend
            renderDay={renderDay}
            renderBubble={renderBubble}
            renderInputToolbar={renderInputToolbar}
            renderActions={renderActions}
          />
        ) : (
          <LoadingContainer>
            <ActivityIndicator size="large" />
          </LoadingContainer>
        )}
      </SafeAreaContainer>

      {isOpen && (
        <ActionsModal
          items={isBubblePress ? bubbleModal : actionsModal}
          isOpen
          onNegative={onNegative}
          onPressFirst={onPressFirst}
          onPressSecond={onPressSecond}
        />
      )}
    </Container>
  );
}

export default memo(RoomScreen);
