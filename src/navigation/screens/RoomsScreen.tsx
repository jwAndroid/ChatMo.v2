import React, { memo, useCallback, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { RowMap } from 'react-native-swipe-list-view';
import uuid from 'react-native-uuid';

import { ActivityIndicator } from 'react-native';
import { useTheme } from '@emotion/react';
import { RootStackNavigationProp } from '../RootStack';
import { createRoom, deleteRoom, onFavoritesRoom } from '../../firebase/posts';
import { fulfilled } from '../../redux/posts/slice';
import {
  FloatingButton,
  IconHeader,
  ListPlaceholder,
  NotificationModal,
  SafeAreaContainer,
  SwipeList,
} from '../../components';
import { RoomEntity } from '../../../types';
import { getTimestamp } from '../../utils/date';
import { fromUpdate } from '../../redux/system/slice';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useRoomsLoadEffect } from '../../hooks/useRoomsLoadEffect';
import { useAnimation } from '../../hooks/useAnimation';

function RoomsScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);

  const { onLoadMore, isLoadMore, isloadFirst } = useRoomsLoadEffect();
  const { onLayoutAnimation } = useAnimation();

  const theme = useTheme();

  const navigation = useNavigation<RootStackNavigationProp>();

  const [isOpen, setIsOpen] = useState(false);
  const [pickedItem, setPickedItem] = useState<RoomEntity | null>(null);

  const notification = useMemo(
    () =>
      '삭제 하시겠습니까?\n삭제를 하면 내용이 모두 삭제되고\n목록에서도 삭제됩니다.',
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
    const room = {
      roomId: uuid.v4().toString(),
      title: posts.data?.length.toString() ?? '1',
      lastMemo: `${posts.data?.length.toString()} 라스트 메모` ?? '1',
      memoCount: 1,
      isFavorites: false,
      isCompleate: false,
      isLock: false,
      password: null,
      createdAt: getTimestamp(),
      updatedAt: 0,
      modifyAt: null,
      chips: [{ id: uuid.v4().toString(), title: 'react' }],
    };

    if (user && posts.data) {
      createRoom(user.userId, room);

      dispatch(fulfilled([room, ...posts.data]));
    }
  }, [dispatch, user, posts.data]);

  const onPressItem = useCallback(
    (item: RoomEntity) => () => {
      if (item && item.password) {
        navigation.navigate('Pin', item);

        dispatch(fromUpdate({ from: 'Room' }));
      } else {
        navigation.navigate('Room', item);
      }
    },
    [dispatch, navigation]
  );

  const onFavorit = useCallback(
    (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => {
      if (rowMap[item.roomId]) {
        rowMap[item.roomId].closeRow();
      }

      if (user && item && posts.data) {
        const updatedRooms = posts.data.map((post: RoomEntity) =>
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

  const onModify = useCallback(
    (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => {
      if (rowMap[item.roomId]) {
        rowMap[item.roomId].closeRow();

        if (item.password) {
          navigation.navigate('Pin', item);

          dispatch(fromUpdate({ from: 'Modify' }));
        } else {
          navigation.navigate('Modify', item);
        }
      }
    },
    [dispatch, navigation]
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
      if (pickedItem.isLock) {
        dispatch(fromUpdate({ from: 'Delete' }));

        delayedModalOpen(false);

        setPickedItem(null);

        navigation.navigate('Pin', pickedItem);
      } else {
        const prepared = posts.data.filter(
          (post: RoomEntity) => post.roomId !== pickedItem.roomId
        );

        deleteRoom(user.userId, pickedItem.roomId);

        dispatch(fulfilled(prepared));

        delayedModalOpen(false);

        setPickedItem(null);

        onLayoutAnimation();
      }
    }
  }, [
    dispatch,
    user,
    pickedItem,
    posts,
    delayedModalOpen,
    navigation,
    onLayoutAnimation,
  ]);

  const onNegative = useCallback(() => {
    delayedModalOpen(false);
  }, [delayedModalOpen]);

  const onPressSearch = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  const test = false;

  return (
    <SafeAreaContainer>
      <IconHeader
        isSettings
        isSearch
        title="목록"
        onPress={onPressSetting}
        onPressSearch={onPressSearch}
      />

      {test ? (
        <SwipeList
          rooms={posts.data}
          onDelete={onDelete}
          onFavorit={onFavorit}
          onModify={onModify}
          onPressItem={onPressItem}
          onEndReached={onLoadMore}
        />
      ) : (
        <ListPlaceholder />
      )}

      {isOpen && (
        <NotificationModal
          isOpen={isOpen}
          notification={notification}
          onNegative={onNegative}
          onPostive={onPostive}
        />
      )}

      {isLoadMore ? (
        <ActivityIndicator size="small" color={theme.color.sky_300} />
      ) : null}

      <FloatingButton onPress={onPressFloatingButton} />
    </SafeAreaContainer>
  );
}

export default memo(RoomsScreen);
