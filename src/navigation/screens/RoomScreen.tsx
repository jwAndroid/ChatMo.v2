import React, {
  memo,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
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
import { createMessage } from '../../firebase/posts';
import {
  ActionButton,
  ChatBubble,
  ChatInputBar,
  DayHeader,
} from '../../components/room';
import { IconHeader } from '../../components/accessory';
import { SafeAreaContainer } from '../../components/layout';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { getTimestamp } from '../../utils/date';
import useBackEffect from '../../hooks/useBackEffect';
import { ActionsModal } from '../../components/modal';
import { actionsModal, bubbleModal } from '../../utils/constants';
import { MessageEntity } from '../../../types';
import { fulfilledChat } from '../../redux/chat/slice';
import {
  deleteMessage,
  loadMessages,
  onModifyMessage,
} from '../../firebase/room';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.color.background,
}));

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Pin'>;

function RoomScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const chat = useAppSelector((state) => state.chat.chat);

  const navigation = useNavigation<RootStackNavigationProp>();
  const { params } = useRoute<RoomScreenRouteProp>();
  const { bottom } = useSafeAreaInsets();

  const [isOpen, setIsOpen] = useState(false);
  const [isBubblePress, setIsBubblePress] = useState(false);
  const [pickedItem, setPickedItem] = useState<MessageEntity | null>(null);

  const userId = useMemo(() => {
    if (user) {
      return {
        _id: user.userId,
      };
    }
  }, [user]);

  useLayoutEffect(() => {
    (async () => {
      if (user && params) {
        const chats = await loadMessages(user.userId, params.roomId);

        if (chats) {
          dispatch(fulfilledChat(chats));
        }
      }
    })();
  }, [dispatch, user, params]);

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
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  }, [isBubblePress]);

  const onPressSecond = useCallback(() => {
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
      setIsOpen(false);
    }
  }, [dispatch, chat.data, params, user, pickedItem, isBubblePress]);

  const onNegative = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Container>
      <IconHeader isBackword isIosTopInset onPress={onBackPress} />

      <SafeAreaContainer>
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
