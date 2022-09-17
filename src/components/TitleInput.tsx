import React, { memo } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const StyledInput = styled.TextInput(({ theme }) => ({
  borderRadius: 8,
  borderWidth: 1,
  fontSize: 15,
  paddingHorizontal: 15,
  paddingVertical: 8,
  marginTop: 10,
  color: theme.color.text,
  borderColor: theme.color.shadow,
}));

interface ITitleInput {
  value: string;
  onChangeText: ((text: string) => void) | undefined;
}
function TitleInput({ value, onChangeText }: ITitleInput) {
  const theme = useTheme();

  return (
    <StyledInput
      placeholder="제목을 입력해주세요."
      placeholderTextColor={theme.color.shadow}
      value={value}
      onChangeText={onChangeText}
      blurOnSubmit
    />
  );
}

export default memo(TitleInput);
