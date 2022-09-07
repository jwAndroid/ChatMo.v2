import React, { memo, useCallback, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  TextInput,
} from 'react-native';
import styled from '@emotion/native';
import { useFocusEffect, useNavigation } from '@react-navigation/core';

import {
  CommonText,
  KeyboardContainer,
  SafeAreaContainer,
} from '../../components';
import { RootStackNavigationProp } from '../RootStack';

const SearchBarContainer = styled.View(() => ({
  height: 60,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 10,
  marginRight: 5,
}));

const SearchBar = styled.TextInput(() => ({
  flex: 1,
  padding: 10,
  fontSize: 15,
  borderRadius: 8,
  marginHorizontal: 10,
  backgroundColor: 'skyblue',
}));

interface Data {
  id: string;
  text: string;
  text2: string;
}

const data = [
  { id: '1', text: '지웅이', text2: 'a' },
  { id: '2', text: '지웅이123', text2: 'abc' },
  { id: '3', text: '나리', text2: 'bgfd' },
  { id: '4', text: '나리호리', text2: 'qwerr' },
  { id: '5', text: '먹보나리', text2: 'ppp' },
  { id: '6', text: '호랑이', text2: 'kk' },
  { id: '7', text: '방탈출123', text2: 'ass' },
  { id: '8', text: '123', text2: 'tyr' },
  { id: '9', text: '대탈출', text2: 'a123' },
];

function SearchScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const ref = useRef<TextInput>(null);

  const [value, setValue] = useState('');
  // const [listData, setListData] = useState<Data[]>(data);

  useFocusEffect(() => {
    if (ref) {
      ref.current?.focus();
    }
  });

  const onPressItem = useCallback(
    (item: Data) => () => {
      console.log(item.text);
    },
    []
  );

  const renderItem = useCallback<ListRenderItem<Data>>(
    ({ item }) => <Text onPress={onPressItem(item)}>{item.text}</Text>,
    [onPressItem]
  );

  // const onChangeText = useCallback((text: string) => {
  //   const prepared = listData.filter(
  //     (data) => data.text.includes(text) || data.text2.includes(text)
  //   );

  //   console.log(prepared);

  //   setValue(text);

  //   setListData(prepared);
  // }, []);

  return (
    <SafeAreaContainer>
      <KeyboardContainer>
        <SearchBarContainer>
          <SearchBar ref={ref} value={value} onChangeText={setValue} />

          <Pressable onPress={() => navigation.goBack()}>
            <CommonText text="취소" fontSize={15} />
          </Pressable>
        </SearchBarContainer>

        <FlatList
          style={{ margin: 10 }}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </KeyboardContainer>
    </SafeAreaContainer>
  );
}

export default memo(SearchScreen);
