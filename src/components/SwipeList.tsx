import React, { memo, useCallback } from 'react';
import { ListRenderItem, Pressable, ListRenderItemInfo } from 'react-native';
import styled from '@emotion/native';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { useTheme } from '@emotion/react';

import RoomsItem from './RoomsItem';
import { RoomEntity } from '../../types';
import useSwipeStyles from '../hooks/useStyles';
import { Post } from '../redux/posts/type';
import Empty from './Empty';

const RowBack = styled.View({
  flex: 1,
  flexDirection: 'row',
});

const ButtonIcon = styled.Image(({ theme }) => ({
  width: 17,
  height: 17,
  tintColor: theme.color.white,
}));

const Footer = styled.View({
  width: '100%',
  height: 5,
});

interface ISwipeList {
  rooms: Post[] | null;
  onPressItem: (item: RoomEntity) => () => void;
  onFavorit: (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => void;
  onLock: (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => void;
  onDelete: (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => void;
}

function SwipeList({
  rooms,
  onPressItem,
  onFavorit,
  onLock,
  onDelete,
}: ISwipeList) {
  const theme = useTheme();

  const { Row, DeleteButton, FavoritButton, LockButton } = useSwipeStyles();

  const key = useCallback((item: RoomEntity) => `${item.roomId}`, []);

  const renderItem = useCallback<ListRenderItem<RoomEntity>>(
    ({ item }) => (
      <Pressable onPress={onPressItem(item)} style={Row}>
        <RoomsItem item={item} />
      </Pressable>
    ),
    [Row, onPressItem]
  );

  const listFooterComponent = useCallback(() => <Footer />, []);

  const ListEmptyComponent = useCallback(
    () => (rooms?.length === 0 ? <Empty /> : null),
    [rooms]
  );

  const renderHiddenItem = useCallback(
    ({ item }: ListRenderItemInfo<RoomEntity>, rowMap: RowMap<RoomEntity>) => (
      <RowBack>
        <Pressable style={FavoritButton} onPress={onFavorit(rowMap, item)}>
          <ButtonIcon source={theme.icon.favorites} />
        </Pressable>

        <Pressable style={LockButton} onPress={onLock(rowMap, item)}>
          <ButtonIcon source={theme.icon.lock} />
        </Pressable>

        <Pressable style={DeleteButton} onPress={onDelete(rowMap, item)}>
          <ButtonIcon source={theme.icon.delete} />
        </Pressable>
      </RowBack>
    ),
    [
      FavoritButton,
      LockButton,
      DeleteButton,
      onFavorit,
      onLock,
      onDelete,
      theme,
    ]
  );

  return (
    <SwipeListView
      data={rooms}
      keyExtractor={key}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      ListEmptyComponent={ListEmptyComponent}
      renderHiddenItem={renderHiddenItem}
      ListFooterComponent={listFooterComponent}
      leftOpenValue={150}
      stopLeftSwipe={150}
      stopRightSwipe={-75}
      rightOpenValue={-75}
      initialNumToRender={15}
    />
  );
}

export default memo(SwipeList);
