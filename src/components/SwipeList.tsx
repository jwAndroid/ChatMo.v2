import React, { memo, useCallback, useMemo } from 'react';
import { ListRenderItem, Pressable, ListRenderItemInfo } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';

import { RoomEntity } from '../../types';
import { SwipeStyles } from '../utils/styles';
import { EmptyContainer } from './layout';
import { FavoritesItem, RoomsItem } from './item';

const RowBack = styled.View(({ theme }) => ({
  flex: 1,
  borderBottomWidth: 1,
  borderBottomColor: theme.color.background,
  backgroundColor: theme.color.background,
}));

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
  rooms: RoomEntity[] | null;
  onPressItem: (item: RoomEntity) => () => void;
  onFavorit: (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => void;
  onModify: (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => void;
  onDelete: (rowMap: RowMap<RoomEntity>, item: RoomEntity) => () => void;
  onEndReached: () => void;
}

function SwipeList({
  rooms,
  onPressItem,
  onFavorit,
  onModify,
  onDelete,
  onEndReached,
}: ISwipeList) {
  const theme = useTheme();

  const { Row, DeleteButton, FavoritButton, LockButton } = SwipeStyles();

  const data = useMemo(
    () =>
      rooms
        ?.filter((room) => !room.isFavorites)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [rooms]
  );

  const key = useCallback((item: RoomEntity) => `${item.roomId}`, []);

  const renderItem = useCallback<ListRenderItem<RoomEntity>>(
    ({ item }) => (
      <Pressable onPress={onPressItem(item)} style={Row}>
        <RoomsItem item={item} />
      </Pressable>
    ),
    [Row, onPressItem]
  );

  const ListHeaderComponent = useCallback(
    () => <FavoritesItem rooms={rooms} />,
    [rooms]
  );

  const renderHiddenItem = useCallback(
    ({ item }: ListRenderItemInfo<RoomEntity>, rowMap: RowMap<RoomEntity>) => (
      <RowBack>
        <Pressable style={FavoritButton} onPress={onFavorit(rowMap, item)}>
          <ButtonIcon
            source={
              item.isFavorites ? theme.icon.favoritesfill : theme.icon.favorites
            }
          />
        </Pressable>

        <Pressable style={LockButton} onPress={onModify(rowMap, item)}>
          <ButtonIcon source={theme.icon.edit} />
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
      onModify,
      onDelete,
      theme,
    ]
  );

  const listFooterComponent = useCallback(() => <Footer />, []);

  const ListEmptyComponent = useCallback(
    () =>
      rooms?.filter((room) => !room.isFavorites).length === 0 ? (
        <EmptyContainer />
      ) : null,
    [rooms]
  );

  return (
    <SwipeListView
      data={data}
      keyExtractor={key}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      leftOpenValue={150}
      stopLeftSwipe={150}
      stopRightSwipe={-75}
      rightOpenValue={-75}
      initialNumToRender={15}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={listFooterComponent}
      onEndReached={onEndReached}
      removeClippedSubviews
      onEndReachedThreshold={0.1}
    />
  );
}

export default memo(SwipeList);
