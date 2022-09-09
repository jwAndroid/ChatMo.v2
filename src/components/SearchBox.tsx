import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  TextInput,
  GestureResponderEvent,
  Pressable,
  Keyboard,
} from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import CommonText from './CommonText';

const SearchBarContainer = styled.View(() => ({
  height: 60,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 15,
}));

const SearchBar = styled.View(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  borderRadius: 8,
  alignItems: 'center',
  backgroundColor: theme.color.bar,
}));

interface IIcon {
  size?: number;
}
const Icon = styled.Image<IIcon>(({ theme, size = 16 }) => ({
  width: size,
  height: size,
  marginHorizontal: 10,
  tintColor: theme.color.icon,
}));

const StyledTextInput = styled.TextInput(({ theme }) => ({
  flex: 1,
  fontSize: 15,
  paddingVertical: 10,
  color: theme.color.text,
}));

const StyledPressable = styled.Pressable(() => ({
  padding: 5,
}));

interface ISearchBox {
  value: string;
  onBackPress: ((event: GestureResponderEvent) => void) | null | undefined;
  onCancelPress: ((event: GestureResponderEvent) => void) | null | undefined;
  onChangeText: ((text: string) => void) | undefined;
}

function SearchBox({
  value,
  onChangeText,
  onCancelPress,
  onBackPress,
}: ISearchBox) {
  const theme = useTheme();

  const ref = useRef<TextInput>(null);

  useEffect(() => {
    if (ref) {
      ref.current?.focus();
    }
  }, []);

  const onSubmitEditing = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  return (
    <SearchBarContainer>
      <SearchBar>
        <Icon source={theme.icon.search} />

        <StyledTextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          onSubmitEditing={onSubmitEditing}
          multiline={false}
          placeholder="검색할 제목을 입력해주세요."
          placeholderTextColor={theme.color.shadow}
        />

        <Pressable onPress={onCancelPress}>
          <Icon source={theme.icon.cancel} size={20} />
        </Pressable>
      </SearchBar>

      <StyledPressable onPress={onBackPress}>
        <CommonText text="취소" fontSize={15} marginLeft={5} marginRight={5} />
      </StyledPressable>
    </SearchBarContainer>
  );
}

export default memo(SearchBox);
