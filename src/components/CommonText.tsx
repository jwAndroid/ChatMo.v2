import React, { memo } from 'react';
import styled from '@emotion/native';

interface IStyledText {
  fontSize?: number;
  marginLeft?: number;
  marginTop?: number;
  marginBottom?: number;
  isSpecificColor?: boolean;
  specificColor?: string;
}

const StyledText = styled.Text<IStyledText>(
  ({
    theme,
    fontSize,
    marginLeft,
    marginTop,
    marginBottom,
    isSpecificColor,
    specificColor,
  }) => ({
    fontSize,
    marginLeft,
    marginTop,
    marginBottom,
    includeFontPadding: false,
    color: isSpecificColor ? specificColor : theme.color.text,
  })
);

interface ICommonText {
  text: string | undefined;
  fontSize?: number;
  marginLeft?: number;
  marginTop?: number;
  marginBottom?: number;
  isSpecificColor?: boolean;
  specificColor?: string;
}

function CommonText({
  text,
  fontSize,
  marginLeft,
  marginTop,
  marginBottom,
  isSpecificColor,
  specificColor,
}: ICommonText) {
  return (
    <StyledText
      fontSize={fontSize}
      marginLeft={marginLeft}
      marginTop={marginTop}
      marginBottom={marginBottom}
      isSpecificColor={isSpecificColor}
      specificColor={specificColor}
    >
      {text}
    </StyledText>
  );
}

CommonText.defaultProps = {
  fontSize: 20,
  marginLeft: 0,
  marginTop: 0,
  marginBottom: 0,
  isSpecificColor: false,
  specificColor: '#000000',
};

export default memo(CommonText);
