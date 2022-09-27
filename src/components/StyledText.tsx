import React, { memo } from 'react';
import styled from '@emotion/native';

interface IEmotionText {
  fontSize?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  specificColor?: string;
}
const EmotionText = styled.Text<IEmotionText>(
  ({
    theme,
    fontSize,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    specificColor = '',
  }) => ({
    fontSize,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    includeFontPadding: false,
    fontFamily: theme.font.SUIT_Regular,
    color: specificColor !== '' ? specificColor : theme.color.text,
  })
);

interface IStyledText {
  text: string | undefined;
  fontSize?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  specificColor?: string;
}

function StyledText({
  text,
  fontSize,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  specificColor,
}: IStyledText) {
  return (
    <EmotionText
      fontSize={fontSize}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      specificColor={specificColor}
    >
      {text}
    </EmotionText>
  );
}

StyledText.defaultProps = {
  fontSize: 20,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  marginBottom: 0,
  specificColor: '',
};

export default memo(StyledText);
