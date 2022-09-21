import React, { memo, useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IMessage, Send, SendProps } from 'react-native-gifted-chat';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';

const Icon = styled.Image({
  width: 15,
  height: 15,
  tintColor: 'white',
});

interface ISendButton {
  props: Readonly<SendProps<IMessage>>;
}
function SendButton({ props }: ISendButton) {
  const theme = useTheme();

  const ContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      width: 30,
      height: 30,
      padding: 3,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 15,
      backgroundColor: theme.color.sky_300,
    }),
    [theme.color.sky_300]
  );

  return (
    <Send {...props} containerStyle={ContainerStyle}>
      <Icon source={theme.icon.edit} />
    </Send>
  );
}

export default memo(SendButton);
