import React, { memo, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from '@emotion/react';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import { RowMap } from 'react-native-swipe-list-view';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { useRoomsLoadEffect } from '../../hooks/useRoomsLoadEffect';
import { fulfilled } from '../../redux/posts/slice';
import { resetChat } from '../../redux/chat/slice';
import { fromUpdate } from '../../redux/system/slice';
import { deleteRoom, onFavoritesRoom } from '../../firebase/posts';
import { RootStackNavigationProp } from '../RootStack';
import { useAnimation } from '../../hooks/useAnimation';
import useBackEffect from '../../hooks/useBackEffect';
import { getTimestamp } from '../../utils/date';
import { RoomEntity } from '../../../types';
import {
  FloatingButton,
  IconHeader,
  SafeAreaContainer,
  SwipeList,
} from '../../components';
import { NotificationModal } from '../../components/modal';

function RoomsScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);

  const { onLoadMore, isLoadMore, isloadFirst } = useRoomsLoadEffect();
  const { onItemAnimation } = useAnimation();

  const theme = useTheme();

  const navigation = useNavigation<RootStackNavigationProp>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pickedItem, setPickedItem] = useState<RoomEntity | null>(null);

  const notification = useMemo(
    () =>
      '삭제 하시겠습니까?\n삭제를 하면 내용이 모두 삭제되고\n목록에서도 삭제됩니다.',
    []
  );

  useBackEffect();

  useFocusEffect(() => {
    dispatch(resetChat());
  });

  const delayedModal = useCallback((isOpen: boolean) => {
    setTimeout(() => {
      setIsDeleteModalOpen(isOpen);
    }, 200);
  }, []);

  const onPressSetting = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  const onPressFloatingButton = useCallback(() => {
    navigation.navigate('Form');
  }, [navigation]);

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

          dispatch(fromUpdate({ from: 'Form' }));
        } else {
          navigation.navigate('Form', item);
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

      delayedModal(true);

      setPickedItem(item);
    },
    [delayedModal]
  );

  const onPostive = useCallback(async () => {
    if (user && pickedItem && posts.data) {
      if (pickedItem.isLock) {
        dispatch(fromUpdate({ from: 'Delete' }));

        delayedModal(false);

        setPickedItem(null);

        navigation.navigate('Pin', pickedItem);
      } else {
        const prepared = posts.data.filter(
          (post: RoomEntity) => post.roomId !== pickedItem.roomId
        );

        deleteRoom(user.userId, pickedItem.roomId);

        dispatch(fulfilled(prepared));

        delayedModal(false);

        setPickedItem(null);

        onItemAnimation();
      }
    }
  }, [
    dispatch,
    user,
    pickedItem,
    posts,
    delayedModal,
    navigation,
    onItemAnimation,
  ]);

  const onNegative = useCallback(() => {
    delayedModal(false);
  }, [delayedModal]);

  const onPressSearch = useCallback(() => {
    navigation.navigate('Search');
  }, [navigation]);

  return (
    <SafeAreaContainer>
      <IconHeader
        isSettings
        isSearch
        title="목록"
        onPress={onPressSetting}
        onPressSearch={onPressSearch}
      />

      {isloadFirst ? (
        <SwipeList
          rooms={posts.data}
          onDelete={onDelete}
          onFavorit={onFavorit}
          onModify={onModify}
          onPressItem={onPressItem}
          onEndReached={onLoadMore}
        />
      ) : (
        <ActivityIndicator size="small" color={theme.color.sky_300} />
      )}

      {isDeleteModalOpen && (
        <NotificationModal
          isOpen={isDeleteModalOpen}
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
