import React, { memo, useCallback, useState } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

interface IStyledInput {
  isFocus: boolean;
}
const StyledInput = styled.TextInput<IStyledInput>(({ theme, isFocus }) => ({
  borderRadius: 8,
  borderWidth: 1,
  fontSize: 15,
  paddingHorizontal: 15,
  paddingVertical: 8,
  marginTop: 10,
  color: theme.color.text,
  borderColor: isFocus ? theme.color.sky_300 : theme.color.shadow,
}));

interface ITitleInput {
  value: string;
  onChangeText: ((text: string) => void) | undefined;
}
function TitleInput({ value, onChangeText }: ITitleInput) {
  const theme = useTheme();

  const [isFocus, setIsFocus] = useState(false);

  const onFocus = useCallback(() => {
    setIsFocus(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocus(false);
  }, []);

  return (
    <StyledInput
      placeholder="제목을 입력해주세요."
      placeholderTextColor={theme.color.shadow}
      value={value}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onBlur={onBlur}
      isFocus={isFocus}
      blurOnSubmit
    />
  );
}

export default memo(TitleInput);
