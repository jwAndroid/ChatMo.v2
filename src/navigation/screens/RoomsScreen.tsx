import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { RowMap } from 'react-native-swipe-list-view';
import uuid from 'react-native-uuid';

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

  const onPressSetting = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  const onPressFloatingButton = useCallback(() => {
    // navigation.navigate('Room');
    const room = {
      roomId: uuid.v4().toString(),
      title: '21번',
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

      setIsOpen(true);

      setPickedItem(item);
    },
    []
  );

  const onPostive = useCallback(async () => {
    if (user && pickedItem && posts.data) {
      deleteRoom(user.userId, pickedItem.roomId);

      const prepared = posts.data.filter(
        (post) => post.roomId !== pickedItem.roomId
      );

      dispatch(fulfilled(prepared));

      setIsOpen(false);

      setPickedItem(null);
    }
  }, [dispatch, user, pickedItem, posts]);

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
          onNegative={() => setIsOpen(false)}
          onPostive={onPostive}
        />
      )}

      <FloatingButton onPress={onPressFloatingButton} />
    </SafeAreaContainer>
  );
}

export default memo(RoomsScreen);
