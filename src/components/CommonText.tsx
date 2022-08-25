import React, { memo } from 'react';
import styled from '@emotion/native';

interface IStyledText {
  fontSize?: number;
  marginLeft?: number;
  marginTop?: number;
  marginBottom?: number;
  color?: string;
}

const StyledText = styled.Text<IStyledText>(
  ({ theme, fontSize, marginLeft, marginTop, marginBottom, color }) => ({
    fontSize,
    marginLeft,
    marginTop,
    marginBottom,
    color: color ?? theme.color.text,
  })
);

interface ICommonText {
  text: string | undefined;
  fontSize?: number;
  marginLeft?: number;
  marginTop?: number;
  marginBottom?: number;
  color?: string;
}

function CommonText({
  text,
  fontSize,
  marginLeft,
  marginTop,
  marginBottom,
  color,
}: ICommonText) {
  return (
    <StyledText
      fontSize={fontSize}
      marginLeft={marginLeft}
      marginTop={marginTop}
      marginBottom={marginBottom}
      color={color}
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
  color: '#000',
};

export default memo(CommonText);
