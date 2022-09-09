import React, { memo, useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  ListRenderItem,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';
import styled from '@emotion/native';
import { useNavigation } from '@react-navigation/core';
import { useTheme } from '@emotion/react';

import { RootState } from '../../redux/rootReducer';
import { RootStackNavigationProp } from '../RootStack';
import {
  Chip,
  CommonText,
  RoomsItem,
  SafeAreaContainer,
  SearchBox,
} from '../../components';
import { ChipEntity, RoomEntity } from '../../../types';

const chipSample = [
  { id: '1', title: 'react-native' },
  { id: '2', title: 'react' },
  { id: '3', title: 'android' },
  { id: '4', title: 'ios' },
  { id: '5', title: 'react-native' },
  { id: '6', title: 'react' },
  { id: '7', title: 'android' },
  { id: '8', title: 'ios' },
];

const HistoryContainer = styled.View(({ theme }) => ({
  justifyContent: 'center',
  marginHorizontal: 15,
  marginBottom: 10,
  borderRadius: 10,
  padding: 10,
  backgroundColor: theme.color.bar,
}));

const ChipContainer = styled.View(() => ({
  flexDirection: 'row',
}));

const InsetsContainer = styled.View(() => ({
  marginRight: 7,
}));

const ResultsContainer = styled.Pressable(({ theme }) => ({
  flex: 1,
  marginHorizontal: 15,
  borderRadius: 10,
  paddingVertical: 5,
  backgroundColor: theme.color.bar,
}));

const Icon = styled.Image(({ theme }) => ({
  width: 15,
  height: 15,
  marginLeft: 3,
  tintColor: theme.color.icon,
}));

function SearchScreen() {
  const posts = useSelector((state: RootState) => state.posts.posts);

  const theme = useTheme();

  const navigation = useNavigation<RootStackNavigationProp>();

  const [value, setValue] = useState('');
  const [chips, setChips] = useState<ChipEntity[]>(chipSample);
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
    ({ item }) => (
      <Pressable onPress={onPressItem(item)} style={{ marginTop: 10 }}>
        <RoomsItem item={item} />
      </Pressable>
    ),
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

  const onCancelPress = useCallback(() => {
    setValue('');

    setRenderData(masterData);
  }, [masterData]);

  const onPressLayout = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const onPressChipDelete = useCallback(
    (item: ChipEntity) => () => {
      const prepared = chips.filter((chip) => chip.id !== item.id);

      setChips(prepared);
    },
    [chips]
  );

  return (
    <SafeAreaContainer>
      <SearchBox
        value={value}
        onChangeText={serchFilterText}
        onBackPress={() => navigation.goBack()}
        onCancelPress={onCancelPress}
      />

      {chips.length > 0 ? (
        <HistoryContainer>
          <CommonText text="최근 검색" fontSize={16} marginBottom={7} />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ChipContainer>
              {chips.map((chip) => (
                <InsetsContainer key={chip.id}>
                  <Chip isRow marginLeft={0}>
                    <CommonText
                      text={chip.title}
                      fontSize={13}
                      isSpecificColor
                      specificColor={theme.color.text}
                    />

                    <Pressable onPress={onPressChipDelete(chip)} hitSlop={10}>
                      <Icon source={theme.icon.cancel} />
                    </Pressable>
                  </Chip>
                </InsetsContainer>
              ))}
            </ChipContainer>
          </ScrollView>
        </HistoryContainer>
      ) : null}

      <ResultsContainer onPress={onPressLayout}>
        <CommonText
          text="검색 결과"
          fontSize={16}
          marginLeft={15}
          marginTop={5}
        />

        <FlatList
          data={renderData}
          keyExtractor={(item) => item.roomId}
          renderItem={renderItem}
        />
      </ResultsContainer>
    </SafeAreaContainer>
  );
}

export default memo(SearchScreen);
