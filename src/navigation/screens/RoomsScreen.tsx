import React, { memo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/core';
import { RowMap } from 'react-native-swipe-list-view';

import {
  FloatingButton,
  IconHeader,
  SafeAreaContainer,
  SwipeList,
} from '../../components';
import { RootStackNavigationProp } from '../RootStack';
import { RoomsEntity } from '../../../types';
import { sample } from '../../../sampleData';

function RoomsScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

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

  const onEdit = useCallback(
    (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => {
      if (rowMap[item.roomId]) {
        rowMap[item.roomId].closeRow();
      }
    },
    []
  );

  const onFavorit = useCallback(
    (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => {
      if (rowMap[item.roomId]) {
        rowMap[item.roomId].closeRow();
      }
    },
    []
  );

  const onLock = useCallback(
    (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => {
      if (rowMap[item.roomId]) {
        rowMap[item.roomId].closeRow();
      }
    },
    []
  );

  const onDelete = useCallback(
    (rowMap: RowMap<RoomsEntity>, item: RoomsEntity) => () => {
      if (rowMap[item.roomId]) {
        rowMap[item.roomId].closeRow();
      }
    },
    []
  );

  return (
    <SafeAreaContainer>
      <IconHeader title="목록" onPress={onPressSetting} />

      <SwipeList
        rooms={sample}
        onDelete={onDelete}
        onEdit={onEdit}
        onFavorit={onFavorit}
        onLock={onLock}
        onPressItem={onPressItem}
      />

      <FloatingButton onPress={onPressFloatingButton} />
    </SafeAreaContainer>
  );
}

export default memo(RoomsScreen);
