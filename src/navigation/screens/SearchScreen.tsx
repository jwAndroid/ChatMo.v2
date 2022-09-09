import React, { memo, useCallback, useEffect, useState } from 'react';
import { FlatList, ListRenderItem, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';

import { RootState } from '../../redux/rootReducer';
import { RootStackNavigationProp } from '../RootStack';
import {
  KeyboardContainer,
  SafeAreaContainer,
  SearchBox,
} from '../../components';
import { RoomEntity } from '../../../types';

function SearchScreen() {
  const posts = useSelector((state: RootState) => state.posts.posts);

  const navigation = useNavigation<RootStackNavigationProp>();

  const [value, setValue] = useState('');
  const [renderData, setRenderData] = useState<RoomEntity[]>([]);
  const [masterData, setMasterData] = useState<RoomEntity[]>([]);

  useEffect(() => {
    if (posts.data) {
      setRenderData(posts.data);
      setMasterData(posts.data);
    }
  }, [posts.data]);

  const onPressItem = useCallback(
    (item: RoomEntity) => () => {
      console.log(JSON.stringify(item, null, 5));
    },
    []
  );

  const renderItem = useCallback<ListRenderItem<RoomEntity>>(
    ({ item }) => <Text onPress={onPressItem(item)}>{item.title}</Text>,
    [onPressItem]
  );

  const serchFilterText = useCallback(
    (value: string) => {
      if (value) {
        const prepared = masterData.filter((item) =>
          item.title.toUpperCase().includes(value.toUpperCase())
        );

        setRenderData(prepared);
      } else {
        setRenderData(masterData);
      }
      setValue(value);
    },
    [masterData]
  );

  return (
    <SafeAreaContainer>
      <KeyboardContainer>
        <SearchBox
          value={value}
          onChangeText={serchFilterText}
          onBackPress={() => navigation.goBack()}
          onCancelPress={() => console.log('cancel')}
        />

        <FlatList
          style={{ margin: 10 }}
          data={renderData}
          keyExtractor={(item) => item.roomId}
          renderItem={renderItem}
        />
      </KeyboardContainer>
    </SafeAreaContainer>
  );
}

export default memo(SearchScreen);
