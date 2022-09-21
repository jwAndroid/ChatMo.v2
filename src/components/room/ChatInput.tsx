import React, { memo, useCallback, useMemo, useState } from 'react';
import { StyleProp, TextStyle, Platform, TextInputProps } from 'react-native';
import { useTheme } from '@emotion/react';
import { Composer, ComposerProps } from 'react-native-gifted-chat';

interface IChatInput {
  props: Readonly<ComposerProps>;
}
function ChatInput({ props }: IChatInput) {
  const theme = useTheme();

  const [isFocus, setIsFocus] = useState(false);

  const TextInputStyle = useMemo<StyleProp<TextStyle>>(
    () => ({
      paddingTop: Platform.OS === 'ios' ? 8 : 6,
      paddingBottom: Platform.OS === 'ios' ? 4 : 6,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: isFocus ? theme.color.sky_300 : theme.color.divider,
      borderRadius: 15,
      fontSize: 13,
      textAlignVertical: 'center',
      color: theme.color.text,
    }),
    [theme, isFocus]
  );

  const onFocus = useCallback(() => {
    setIsFocus(true);
  }, []);

  const onBlur = useCallback(() => {
    setIsFocus(false);
  }, []);

  const TextInputProps = useMemo<TextInputProps>(
    () => ({
      autoCapitalize: 'none',
      autoCompleteType: 'off',
      autoCorrect: false,
      textContentType: 'none',
      placeholderTextColor: theme.color.shadow,
      keyboardType: 'default',
      returnKeyType: 'send',
      numberOfLines: 3,
      onFocus,
      onBlur,
    }),
    [theme.color.shadow, onFocus, onBlur]
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
