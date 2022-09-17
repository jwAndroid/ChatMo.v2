import React from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const StyledInput = styled.TextInput(({ theme }) => ({
  width: 60,
  borderBottomWidth: 1,
  textAlign: 'center',
  fontSize: 15,
  color: theme.color.text,
  padding: 3,
  borderBottomColor: '#0099ff',
}));

interface IPasswordInput {
  value: string;
  onChangeText: ((text: string) => void) | undefined;
}
function PasswordInput({ value, onChangeText }: IPasswordInput) {
  const theme = useTheme();

  return (
    <StyledInput
      value={value}
      onChangeText={onChangeText}
      maxLength={4}
      placeholder="* * * *"
      placeholderTextColor={theme.color.shadow}
      keyboardType="number-pad"
      clearTextOnFocus
      returnKeyType="done"
      secureTextEntry
    />
  );
}

export default PasswordInput;
