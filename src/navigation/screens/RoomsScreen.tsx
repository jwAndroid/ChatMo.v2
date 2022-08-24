import React, { memo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import styled from '@emotion/native';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';

import { ListRenderItem, ListRenderItemInfo, Pressable } from 'react-native';
import { useTheme } from '@emotion/react';
import { RootStackNavigationProp } from '../RootStack';
import {
  CommonText,
  FloatingButton,
  IconHeader,
  RoomsItem,
  SafeAreaContainer,
} from '../../components';
import useStyles from '../../hooks/useStyles';
import { RoomsEntity } from '../../../types';
import { sample } from '../../../sampleData';

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

function RoomsScreen() {
  const theme = useTheme();

  // const [rooms, setRooms] = useState<RoomsEntity[]>(sample);

  const navigation = useNavigation<RootStackNavigationProp>();

  const { Row, DeleteButton, EditButton, FavoritButton, LockButton } =
    useStyles();

  const key = useCallback((item: RoomsEntity) => `${item.roomId}`, []);

  const onPressSetting = useCallback(() => {
    navigation.navigate('Setting');
  }, [navigation]);

  const onPressFloatingButton = useCallback(() => {
    navigation.navigate('Room');
  }, [navigation]);

  const onPressItem = useCallback(
    (item: RoomsEntity) => () => {
      navigation.navigate('Room', item);
    },
    [navigation]
  );

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
      sample.length === 0 ? (
        <CommonText text="결과가 존재하지 않습니다." />
      ) : null,
    []
  );

  const onEdit = useCallback(
    (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => {
      // console.log(rowMap);
      console.log(item);
    },
    []
  );

  const onFavorit = useCallback(
    (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => {
      console.log(rowMap);
      console.log(item);
    },
    []
  );

  const onLock = useCallback(
    (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => {
      console.log(rowMap);
      console.log(item);
    },
    []
  );

  const onDelete = useCallback(
    (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => {
      console.log(rowMap);
      console.log(item);
    },
    []
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
    <SafeAreaContainer>
      <IconHeader title="목록" onPress={onPressSetting} />

      <SwipeListView
        data={sample}
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

      <FloatingButton onPress={onPressFloatingButton} />
    </SafeAreaContainer>
  );
}

export default memo(RoomsScreen);
