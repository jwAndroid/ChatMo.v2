import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { RowMap } from 'react-native-swipe-list-view';
import uuid from 'react-native-uuid';

import { deleteDoc, doc } from 'firebase/firestore';
import { RootState } from '../../redux/rootReducer';
import { RootStackNavigationProp } from '../RootStack';
import { createRoom } from '../../firebase/posts';
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
import { firestore } from '../../firebase/config';

function RoomsScreen() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const navigation = useNavigation<RootStackNavigationProp>();

  const [isOpen, setIsOpen] = useState(false);

  const onPressSetting = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  const onPressFloatingButton = useCallback(() => {
    console.log('onPressFloatingButton');
    // navigation.navigate('Room');
    const room = {
      roomId: uuid.v4().toString(),
      title: '15번',
      lastMemo: 'string',
      memoCount: 1,
      isFavorites: true,
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
    },
    []
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
    },
    []
  );

  const onPostive = useCallback(async () => {
    if (user) {
      await deleteDoc(
        doc(
          firestore,
          'posts',
          'users',
          user?.userId,
          'rooms',
          'room',
          '32c9652b-798c-410e-b519-c0f8e9277b8a'
        )
      );
    }

    setIsOpen(false);
  }, [user]);

  const onNegative = useCallback(() => {
    setIsOpen(false);
  }, []);

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
