import React, { memo } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import CommonText from './CommonText';

const Block = styled.View(() => ({
  width: '100%',
  height: 80,
  marginBottom: 10,
  flexDirection: 'row',
}));

interface IButton {
  backgroundColor: string;
}

const Button = styled.Pressable<IButton>(({ backgroundColor }) => ({
  flex: 1,
  margin: 10,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
  backgroundColor,
}));

interface IButtonBar {
  onCancel: () => void;
  onConfirm: () => void;
}

function ButtonBar({ onCancel, onConfirm }: IButtonBar) {
  const theme = useTheme();

  return (
    <Block>
      <Button backgroundColor={theme.color.placeholder} onPress={onCancel}>
        <CommonText text="취소" fontSize={14} />
      </Button>

      <Button backgroundColor={theme.color.sky_300} onPress={onConfirm}>
        <CommonText text="확인" fontSize={14} />
      </Button>
    </Block>
  );
}

export default memo(ButtonBar);
