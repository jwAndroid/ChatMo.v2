import { StyleProp, TextStyle, Platform, TextInputProps } from 'react-native';
import React, { memo, useMemo } from 'react';
import { Composer, ComposerProps } from 'react-native-gifted-chat';
import { useTheme } from '@emotion/react';

interface IChatInput {
  props: Readonly<ComposerProps>;
}
function ChatInput({ props }: IChatInput) {
  const theme = useTheme();

  const TextInputStyle = useMemo<StyleProp<TextStyle>>(
    () => ({
      paddingTop: Platform.OS === 'ios' ? 8 : 6,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: theme.color.divider,
      borderRadius: 15,
      fontSize: 13,
      textAlignVertical: 'center',
      color: theme.color.text,
    }),
    [theme]
  );

  const TextInputProps = useMemo<TextInputProps>(
    () => ({
      autoCapitalize: 'none',
      autoCompleteType: 'off',
      autoCorrect: false,
      textContentType: 'none',
      placeholderTextColor: theme.color.shadow,
      keyboardType: 'default',
      returnKeyType: 'send',
      numberOfLines: 5,
    }),
    [theme.color.shadow]
  );

  return (
    <Composer
      {...props}
      textInputStyle={TextInputStyle}
      textInputProps={TextInputProps}
      placeholder="메모를 입력하세요."
      placeholderTextColor={theme.color.shadow}
      keyboardAppearance={theme.name === 'lightTheme' ? 'light' : 'dark'}
    />
  );
}

export default memo(ChatInput);
