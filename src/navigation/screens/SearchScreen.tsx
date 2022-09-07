import React, { memo, useRef, useState } from 'react';
import { Pressable, Text, TextInput } from 'react-native';
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

function SearchScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const ref = useRef<TextInput>(null);

  const [value, setValue] = useState('');

  useFocusEffect(() => {
    if (ref) {
      ref.current?.focus();
    }
  });

  return (
    <SafeAreaContainer>
      <KeyboardContainer>
        <SearchBarContainer>
          <SearchBar ref={ref} value={value} onChangeText={setValue} />

          <Pressable onPress={() => navigation.goBack()}>
            <CommonText text="취소" fontSize={15} />
          </Pressable>
        </SearchBarContainer>

        <Text>data</Text>
      </KeyboardContainer>
    </SafeAreaContainer>
  );
}

export default memo(SearchScreen);
