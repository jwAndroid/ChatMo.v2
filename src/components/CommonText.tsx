import React, { memo } from 'react';
import styled from '@emotion/native';

interface IStyledText {
  fontSize?: number;
  marginLeft?: number;
  marginTop?: number;
  marginBottom?: number;
}

const StyledText = styled.Text<IStyledText>(
  ({ theme, fontSize, marginLeft, marginTop, marginBottom }) => ({
    fontSize,
    marginLeft,
    marginTop,
    marginBottom,
    includeFontPadding: false,
    color: theme.color.text,
  })
);

interface ICommonText {
  text: string | undefined;
  fontSize?: number;
  marginLeft?: number;
  marginTop?: number;
  marginBottom?: number;
}

function CommonText({
  text,
  fontSize,
  marginLeft,
  marginTop,
  marginBottom,
}: ICommonText) {
  return (
    <StyledText
      fontSize={fontSize}
      marginLeft={marginLeft}
      marginTop={marginTop}
      marginBottom={marginBottom}
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
};

export default memo(CommonText);
