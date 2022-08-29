import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { RowMap } from 'react-native-swipe-list-view';
import uuid from 'react-native-uuid';

import { RootState } from '../../redux/rootReducer';
import {
  FloatingButton,
  IconHeader,
  SafeAreaContainer,
  SwipeList,
} from '../../components';
import { RootStackNavigationProp } from '../RootStack';
import { RoomEntity } from '../../../types';
import { createRoom } from '../../firebase/posts';
import { getTimestamp } from '../../utils/date';
import { fulfilled } from '../../redux/posts/slice';

function RoomsScreen() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const navigation = useNavigation<RootStackNavigationProp>();

  const onPressSetting = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  const onPressFloatingButton = useCallback(() => {
    console.log('onPressFloatingButton');
    // navigation.navigate('Room');
    const room = {
      roomId: uuid.v4().toString(),
      title: '13번',
      lastMemo: 'string',
      memoCount: 1,
      isFavorites: true,
      isCompleate: true,
      isPin: true,
      isLock: true,
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
    },
    []
  );

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

      <FloatingButton onPress={onPressFloatingButton} />
    </SafeAreaContainer>
  );
}

export default memo(RoomsScreen);
