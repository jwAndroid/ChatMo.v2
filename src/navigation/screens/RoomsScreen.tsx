import React, { memo, useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { RowMap } from 'react-native-swipe-list-view';
import uuid from 'react-native-uuid';

import { LayoutAnimation } from 'react-native';
import { RootState } from '../../redux/rootReducer';
import { RootStackNavigationProp } from '../RootStack';
import { createRoom, deleteRoom, onFavoritesRoom } from '../../firebase/posts';
import { fulfilled } from '../../redux/posts/slice';
import {
  FloatingButton,
  IconHeader,
  NotificationModal,
  SafeAreaContainer,
  SwipeList,
} from '../../components';
import { RoomEntity } from '../../../types';
import { getTimestamp } from '../../utils/date';

function RoomsScreen() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const navigation = useNavigation<RootStackNavigationProp>();

  const [isOpen, setIsOpen] = useState(false);
  const [pickedItem, setPickedItem] = useState<RoomEntity | null>(null);

  const animationConfig = useMemo(
    () => ({
      duration: 300,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    }),
    []
  );

  const delayedModalOpen = useCallback((isOpen: boolean) => {
    setTimeout(() => {
      setIsOpen(isOpen);
    }, 200);
  }, []);

  const onPressSetting = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  const onPressFloatingButton = useCallback(() => {
    // navigation.navigate('Room');
    const room = {
      roomId: uuid.v4().toString(),
      title: '22번',
      lastMemo: 'string',
      memoCount: 1,
      isFavorites: false,
      isCompleate: true,
      isPin: true,
      isLock: false,
      password: 123,
      status: 123,
      createdAt: getTimestamp(),
      updatedAt: 123,
      lastUpdateOn: 123,
      chips: ['hello world', 'jw', 'develop'],
    };

    if (user && posts.data) {
      createRoom(user.userId, room);

      dispatch(fulfilled([room, ...posts.data]));
    }
  }, [dispatch, user, posts.data]);

  const onPressItem = useCallback(
    (item: RoomEntity) => () => {
      navigation.navigate('Room', item);
    },
    [navigation]
  );

  const onFavorit = useCallback(
    (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => {
      if (rowMap[item.roomId]) {
        rowMap[item.roomId].closeRow();
      }

      if (user && item && posts.data) {
        const updatedRooms = posts.data.map((post) =>
          post.roomId === item.roomId
            ? {
                ...post,
                isFavorites: !item.isFavorites,
                updatedAt: getTimestamp(),
              }
            : post
        );

        dispatch(fulfilled(updatedRooms));

        onFavoritesRoom(user.userId, item);
      }
    },
    [dispatch, user, posts]
  );

  const onLock = useCallback(
    (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => {
      if (rowMap[item.roomId]) {
        rowMap[item.roomId].closeRow();
      }
    },
    []
  );

  const onDelete = useCallback(
    (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => {
      if (rowMap[item.roomId]) {
        rowMap[item.roomId].closeRow();
      }

      delayedModalOpen(true);

      setPickedItem(item);
    },
    [delayedModalOpen]
  );

  const onPostive = useCallback(async () => {
    if (user && pickedItem && posts.data) {
      deleteRoom(user.userId, pickedItem.roomId);

      const prepared = posts.data.filter(
        (post) => post.roomId !== pickedItem.roomId
      );

      dispatch(fulfilled(prepared));

      delayedModalOpen(false);

      setPickedItem(null);

      LayoutAnimation.configureNext(animationConfig);
    }
  }, [dispatch, user, pickedItem, posts, animationConfig, delayedModalOpen]);

  const onNegative = useCallback(() => {
    delayedModalOpen(false);
  }, [delayedModalOpen]);

  return (
    <SafeAreaContainer>
      <IconHeader isRightIcon title="목록" onPress={onPressSetting} />

      <SwipeList
        rooms={posts.data}
        onDelete={onDelete}
        onFavorit={onFavorit}
        onLock={onLock}
        onPressItem={onPressItem}
      />
      {isOpen && (
        <NotificationModal
          isOpen={isOpen}
          onNegative={onNegative}
          onPostive={onPostive}
        />
      )}

      <FloatingButton onPress={onPressFloatingButton} />
    </SafeAreaContainer>
  );
}

export default memo(RoomsScreen);
