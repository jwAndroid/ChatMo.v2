import React, { memo, ReactNode, useMemo } from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Day, DayProps, IMessage } from 'react-native-gifted-chat';
import { useTheme } from '@emotion/react';

const days = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

interface IDayHeader {
  props: Readonly<DayProps<IMessage>> & Readonly<{ children?: ReactNode }>;
}

function DayHeader({ props }: IDayHeader) {
  const theme = useTheme();

  const containerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({ marginTop: 10, marginBottom: 10 }),
    []
  );

  const textStyle = useMemo<StyleProp<TextStyle>>(
    () => ({
      fontSize: 12,
      textAlignVertical: 'center',
      color: theme.color.text,
      fontWeight: '500',
    }),
    [theme]
  );

  return (
    <Day
      {...props}
      containerStyle={containerStyle}
      textStyle={textStyle}
      dateFormat={`YYYY년 M월 D일 ${days[new Date().getDay()]}`}
    />
  );
}

export default memo(DayHeader);
