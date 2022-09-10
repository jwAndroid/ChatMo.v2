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
import historyStorage from '../../storages/historyStorage';

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
  marginHorizontal: 20,
  marginBottom: 10,
  marginTop: 10,
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
  marginHorizontal: 20,
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

  /**
   * const array = ['C', 'A', 'B', 'A', 'C', 'D', 'C', 'C', 'E', 'D'];
     console.log(array); // ['C', 'A', 'B', 'A', 'C', 'D', 'C', 'C', 'E', 'D']

     const result = array.filter((v, i) => array.indexOf(v) === i);
     console.log(result); // ['C', 'A', 'B', 'D', 'E']
   */

  // TODO: 플레인 텍스트뷰 블러-> 스토리지에 저장하는 작업
  // TODO: 불러오는 작업
  // TODO: 새로운 값이 들어갈때 맨 앞으로 떙겨주는 작업
  // TODO: 중복제거 하여 최종적으로 렌더링 해주는 작업.

  useEffect(() => {
    (async () => {
      const chipSample = [
        { id: '1', title: 'react-1' },
        { id: '2', title: '2asdf' },
        { id: '3', title: '3aseg' },
        { id: '4', title: 'aseg4' },
        { id: '5', title: 'react-aseg' },
        { id: '6', title: 'aseg' },
        { id: '7', title: 'efe' },
        { id: '8', title: 'asegaseg' },
      ];

      historyStorage.set(chipSample);

      const data = await historyStorage.get();

      console.log(data);
    })();
  }, []);

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

  const onEndEditing = useCallback(() => {}, []);

  const onSubmitEditing = useCallback(() => {}, []);

  return (
    <SafeAreaContainer>
      <SearchBox
        value={value}
        onChangeText={serchFilterText}
        onBackPress={() => navigation.goBack()}
        onCancelPress={onCancelPress}
        onEndEditing={onEndEditing}
        onSubmitEditing={onSubmitEditing}
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
