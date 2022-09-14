import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  FlatList,
  Keyboard,
  ListRenderItem,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useNavigation } from '@react-navigation/core';

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
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { loadPosts } from '../../firebase/posts';
import { fromUpdate } from '../../redux/system/slice';

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

const ResultsContainer = styled.View(({ theme }) => ({
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
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const theme = useTheme();

  const navigation = useNavigation<RootStackNavigationProp>();

  const [value, setValue] = useState('');
  const [chips, setChips] = useState<ChipEntity[]>([]);
  const [renderData, setRenderData] = useState<RoomEntity[]>([]);
  const [masterData, setMasterData] = useState<RoomEntity[]>([]);

  useLayoutEffect(() => {
    (async () => {
      if (user && user.userId) {
        const posts = await loadPosts(user.userId);

        if (posts) {
          setRenderData(posts);

          setMasterData(posts);
        }
      }
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      const data = await historyStorage.get();

      setChips(data);
    })();
  }, []);

  const onBackPress = useCallback(() => {
    navigation.goBack();
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

  const renderItem = useCallback<ListRenderItem<RoomEntity>>(
    ({ item }) => (
      <Pressable onPress={onPressItem(item)} style={{ marginTop: 15 }}>
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

  const ListHeaderComponent = useCallback(
    () => (
      <CommonText
        text="검색 결과"
        fontSize={16}
        marginLeft={15}
        marginTop={5}
      />
    ),
    []
  );

  const ListFooterComponent = useCallback(
    () => <View style={{ marginBottom: 20 }} />,
    []
  );

  const onPressChip = useCallback(
    (chip: ChipEntity) => () => {
      if (chip && chip.title) {
        setValue(chip.title);

        const prepared = masterData.filter((item) =>
          item.title.toUpperCase().includes(chip.title.toUpperCase())
        );

        setRenderData(prepared);
      }
    },
    [masterData]
  );

  return (
    <SafeAreaContainer>
      <SearchBox
        value={value}
        onChangeText={serchFilterText}
        onBackPress={onBackPress}
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
              <CommonText
                text="전체 삭제"
                fontSize={13}
                marginBottom={7}
                marginRight={5}
              />
            </Pressable>
          </Row>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ChipContainer>
              {chips.map((chip) => (
                <InsetsContainer key={chip.id}>
                  <Chip isRow marginLeft={0} onPress={onPressChip(chip)}>
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

      <ResultsContainer>
        <FlatList
          data={renderData}
          keyExtractor={(item) => item.roomId}
          bounces={false}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          initialNumToRender={13}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
        />
      </ResultsContainer>
    </SafeAreaContainer>
  );
}

export default memo(SearchScreen);
