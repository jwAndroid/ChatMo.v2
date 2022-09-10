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
import { useTheme } from '@emotion/react';
import { useNavigation } from '@react-navigation/core';

import { RootState } from '../../redux/rootReducer';
import historyStorage from '../../storages/historyStorage';
import deduplicationStorage from '../../storages/deduplicationStorage';
import { RootStackNavigationProp } from '../RootStack';
import {
  Chip,
  CommonText,
  RoomsItem,
  SafeAreaContainer,
  SearchBox,
} from '../../components';
import { ChipEntity, RoomEntity } from '../../../types';

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
  marginTop: 7,
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

const Row = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

function SearchScreen() {
  const posts = useSelector((state: RootState) => state.posts.posts);

  const theme = useTheme();

  const navigation = useNavigation<RootStackNavigationProp>();

  const [value, setValue] = useState('');
  const [chips, setChips] = useState<ChipEntity[]>([]);
  const [renderData, setRenderData] = useState<RoomEntity[]>([]);
  const [masterData, setMasterData] = useState<RoomEntity[]>([]);

  useEffect(() => {
    if (posts.data) {
      setRenderData(posts.data);

      setMasterData(posts.data);
    }
  }, [posts.data]);

  useEffect(() => {
    (async () => {
      const data = await historyStorage.get();

      setChips(data);
    })();
  }, []);

  const onPressItem = useCallback(
    (item: RoomEntity) => () => {
      if (item) {
        navigation.navigate('Room', item);
      }
    },
    [navigation]
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

  const onPressChipDelete = useCallback(
    (item: ChipEntity) => () => {
      const prepared = chips.filter((chip) => chip.id !== item.id);

      historyStorage.set(prepared);

      setChips(prepared);
    },
    [chips]
  );

  const onEndEditing = useCallback(() => {
    const deduplication = deduplicationStorage(value, chips);

    if (deduplication) {
      setChips(deduplication);
    }
  }, [value, chips]);

  const onSubmitEditing = useCallback(() => {
    deduplicationStorage(value, chips);

    Keyboard.dismiss();
  }, [value, chips]);

  const onPressClearHistory = useCallback(() => {
    setChips([]);

    historyStorage.set([]);
  }, []);

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
          <Row>
            <CommonText
              text="최근 검색"
              fontSize={16}
              marginBottom={7}
              marginLeft={5}
            />

            <Pressable onPress={onPressClearHistory} hitSlop={10}>
              <CommonText text="전체 삭제" fontSize={13} marginBottom={7} />
            </Pressable>
          </Row>

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

      <ResultsContainer onPress={() => Keyboard.dismiss()}>
        <CommonText
          text="검색 결과"
          fontSize={16}
          marginLeft={15}
          marginTop={5}
        />

        <FlatList
          data={renderData}
          keyExtractor={(item) => item.roomId}
          bounces={false}
          initialNumToRender={13}
          renderItem={renderItem}
        />
      </ResultsContainer>
    </SafeAreaContainer>
  );
}

export default memo(SearchScreen);
