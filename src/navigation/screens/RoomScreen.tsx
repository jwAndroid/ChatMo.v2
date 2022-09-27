import React, {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import styled from '@emotion/native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';
import {
  BubbleProps,
  DayProps,
  GiftedChat,
  InputToolbarProps,
  MessageImageProps,
} from 'react-native-gifted-chat';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';

import { useTheme } from '@emotion/react';
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

import { ChatBubble, DayHeader, IconHeader } from '../../components';
import { ActionsModal, Carousell, ToastModal } from '../../components/modal';
import { ActionButton } from '../../components/button';
import { ChatInputBar } from '../../components/input';
import { SafeAreaContainer } from '../../components/layout';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.color.background,
}));

const LoadingContainer = styled.View(() => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}));

const ImageHolder = styled.Image(() => ({
  width: 180,
  height: 280,
  marginVertical: 5,
  borderRadius: 10,
}));

const ScrollToBottom = styled.Image(({ theme }) => ({
  width: 25,
  height: 25,
  transform: [{ rotate: '270deg' }],
  tintColor: theme.color.white,
}));

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Pin'>;

function RoomScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);
  const chat = useAppSelector((state) => state.chat.chat);

  const theme = useTheme();

  const navigation = useNavigation<RootStackNavigationProp>();
  const { params } = useRoute<RoomScreenRouteProp>();

  const { bottom } = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);

  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [isCaroucellOpen, setIsCaroucellOpen] = useState(false);
  const [imageSource, setImageSource] = useState('');
  const [isBubblePress, setIsBubblePress] = useState(false);

  const [pickedItem, setPickedItem] = useState<MessageEntity | null>(null);
  const [firstLength, setFirstLength] = useState<number>();

  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const userId = useMemo(
    () => (user ? { _id: user.userId } : undefined),
    [user]
  );

  const ScrollToBottomStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      width: 35,
      height: 35,
      marginRight: 4,
      backgroundColor: theme.color.divider,
    }),
    [theme]
  );

  useBackEffect();

  useEffect(() => {
    (async () => {
      const { granted } = await MediaLibrary.requestPermissionsAsync();

      setHasGalleryPermission(granted);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { granted } = await Camera.requestCameraPermissionsAsync();

      setHasCameraPermission(granted);
    })();
  }, []);

  useLayoutEffect(() => {
    (async () => {
      setIsLoading(false);

      if (user && params) {
        const chats = await loadMessages(user.userId, params.roomId);

        if (chats) {
          dispatch(fulfilledChat(chats));

          setIsLoading(true);

          setFirstLength(chats.length);
        }
      }
    })();
  }, [dispatch, user, params]);

  const onBackPress = useCallback(async () => {
    if (chat.data && chat.data.length > 0 && params && user && posts.data) {
      if (firstLength !== chat.data.length) {
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
  }, [dispatch, chat.data, params, user, posts.data, navigation, firstLength]);

  const onSend = useCallback(
    async (messages: MessageEntity[]) => {
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

        await createMessage(user.userId, params.roomId, message);

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

      setIsActionsOpen(true);
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

  const onPressImage = useCallback(
    (source: string) => () => {
      setImageSource(source);

      setIsCaroucellOpen(true);
    },
    []
  );

  const renderMessageImage = useCallback(
    (
      props: Readonly<MessageImageProps<MessageEntity>> &
        Readonly<{ children?: ReactNode }>
    ) => {
      if (props.currentMessage && props.currentMessage.image) {
        const { image } = props.currentMessage;

        return (
          <Pressable onPress={onPressImage(image)}>
            <ImageHolder source={{ uri: image }} />
          </Pressable>
        );
      }

      return null;
    },
    [onPressImage]
  );

  const onPressAction = useCallback(() => {
    setIsBubblePress(false);

    setIsActionsOpen(true);
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

        setIsActionsOpen(false);

        setPickedItem(null);
      }
    } else {
      if (params && hasCameraPermission) {
        navigation.navigate('Camera', params);
      }

      setIsActionsOpen(false);
    }
  }, [
    dispatch,
    chat.data,
    params,
    user,
    pickedItem,
    isBubblePress,
    navigation,
    hasCameraPermission,
  ]);

  const onPressSecond = useCallback(() => {
    if (isBubblePress) {
      setIsActionsOpen(false);
    } else {
      if (params && hasGalleryPermission) {
        navigation.navigate('Gallery', params);
      }

      setIsActionsOpen(false);
    }
  }, [navigation, isBubblePress, params, hasGalleryPermission]);

  const onNegative = useCallback(() => {
    setIsActionsOpen(false);
  }, []);

  const scrollToBottomComponent = useCallback(
    () => <ScrollToBottom source={theme.icon.backward} />,
    [theme.icon.backward]
  );

  return (
    <Container>
      <IconHeader isBackword isIosTopInset onPress={onBackPress} />

      <SafeAreaContainer>
        {isLoading ? (
          <GiftedChat
            user={userId}
            messages={chat.data}
            onSend={onSend}
            alignTop
            scrollToBottom
            alwaysShowSend
            showUserAvatar={false}
            renderDay={renderDay}
            renderBubble={renderBubble}
            renderActions={renderActions}
            renderInputToolbar={renderInputToolbar}
            renderMessageImage={renderMessageImage}
            scrollToBottomStyle={ScrollToBottomStyle}
            scrollToBottomComponent={scrollToBottomComponent}
            bottomOffset={bottom === 0 ? 0 : bottom - 3}
          />
        ) : (
          <LoadingContainer>
            <ActivityIndicator size="large" color={theme.color.chip} />
          </LoadingContainer>
        )}
      </SafeAreaContainer>

      {isActionsOpen ? (
        <ActionsModal
          items={isBubblePress ? bubbleModal : actionsModal}
          isOpen
          onNegative={onNegative}
          onPressFirst={onPressFirst}
          onPressSecond={onPressSecond}
        />
      ) : null}

      {isToastOpen ? (
        <ToastModal
          text="카메라 또는 앨범 권한을 허용해주세요."
          showToast={isToastOpen}
          setShowToast={setIsToastOpen}
        />
      ) : null}

      {isCaroucellOpen ? (
        <Carousell
          isOpen={isCaroucellOpen}
          setIsOpen={setIsCaroucellOpen}
          source={imageSource}
        />
      ) : null}
    </Container>
  );
}

export default memo(RoomScreen);
