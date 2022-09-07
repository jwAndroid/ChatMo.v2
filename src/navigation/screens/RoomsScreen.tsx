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
import { fromUpdate } from '../../redux/system/slice';

function RoomsScreen() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const navigation = useNavigation<RootStackNavigationProp>();

  const [isOpen, setIsOpen] = useState(false);
  const [pickedItem, setPickedItem] = useState<RoomEntity | null>(null);

  const notification = useMemo(
    () =>
      '삭제 하시겠습니까?\n삭제를 하면 내용이 모두 삭제되고\n목록에서도 삭제됩니다.',
    []
  );

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
    const room = {
      roomId: uuid.v4().toString(),
      title: '5 title',
      lastMemo: 'first memo',
      memoCount: null,
      isFavorites: false,
      isCompleate: false,
      isLock: true,
      password: '1234',
      createdAt: getTimestamp(),
      updatedAt: 123,
      modifyAt: null,
      chips: [{ id: uuid.v4().toString(), title: 'asdasdasd' }],
    };

    if (user && posts.data) {
      createRoom(user.userId, room);

      dispatch(fulfilled([room, ...posts.data]));
    }
  }, [dispatch, user, posts.data]);

  const onPressItem = useCallback(
    (item: RoomEntity) => () => {
      if (item.password) {
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
          (post) => post.roomId !== pickedItem.roomId
        );

        deleteRoom(user.userId, pickedItem.roomId);

        dispatch(fulfilled(prepared));

        delayedModalOpen(false);

        setPickedItem(null);

        LayoutAnimation.configureNext(animationConfig);
      }
    }
  }, [
    dispatch,
    user,
    pickedItem,
    posts,
    animationConfig,
    delayedModalOpen,
    navigation,
  ]);

  const onNegative = useCallback(() => {
    delayedModalOpen(false);
  }, [delayedModalOpen]);

  return (
    <SafeAreaContainer>
      <IconHeader isSettings title="목록" onPress={onPressSetting} />

      <SwipeList
        rooms={posts.data}
        onDelete={onDelete}
        onFavorit={onFavorit}
        onModify={onModify}
        onPressItem={onPressItem}
      />
      {isOpen && (
        <NotificationModal
          isOpen={isOpen}
          notification={notification}
          onNegative={onNegative}
          onPostive={onPostive}
        />
      )}

      <FloatingButton onPress={onPressFloatingButton} />
    </SafeAreaContainer>
  );
}

export default memo(RoomsScreen);
