import React, { memo, useCallback } from 'react';
import { ListRenderItem, Pressable, ListRenderItemInfo } from 'react-native';
import styled from '@emotion/native';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';

import { useTheme } from '@emotion/react';
import useStyles from '../hooks/useStyles';
import CommonText from './CommonText';
import RoomsItem from './RoomsItem';
import { RoomsEntity } from '../../types';

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
  rooms: RoomsEntity[];
  onPressItem: (item: RoomsEntity) => () => void;
  onEdit: (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => void;
  onFavorit: (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => void;
  onLock: (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => void;
  onDelete: (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => void;
}

function SwipeList({
  rooms,
  onPressItem,
  onEdit,
  onFavorit,
  onLock,
  onDelete,
}: ISwipeList) {
  const theme = useTheme();

  const { Row, DeleteButton, EditButton, FavoritButton, LockButton } =
    useStyles();

  const key = useCallback((item: RoomsEntity) => `${item.roomId}`, []);

  const renderItem = useCallback<ListRenderItem<RoomsEntity>>(
    ({ item }) => (
      <Pressable onPress={onPressItem(item)} style={Row}>
        <RoomsItem item={item} />
      </Pressable>
    ),
    [Row, onPressItem]
  );

  const listFooterComponent = useCallback(() => <Footer />, []);

  const ListEmptyComponent = useCallback(
    () =>
      rooms.length === 0 ? (
        <CommonText text="결과가 존재하지 않습니다." />
      ) : null,
    [rooms]
  );

  const renderHiddenItem = useCallback(
    (
      { item }: ListRenderItemInfo<RoomsEntity>,
      rowMap: RowMap<RoomsEntity>
    ) => (
      <RowBack>
        <Pressable style={EditButton} onPress={onEdit(rowMap, item)}>
          <ButtonIcon source={theme.icon.edit} />
        </Pressable>

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
      EditButton,
      FavoritButton,
      LockButton,
      DeleteButton,
      onEdit,
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
      leftOpenValue={225}
      stopLeftSwipe={225}
      stopRightSwipe={-75}
      rightOpenValue={-75}
    />
  );
}

export default memo(SwipeList);
