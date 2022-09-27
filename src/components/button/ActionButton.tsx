import React, { memo } from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';

const ButtonContainer = styled.Pressable(({ theme }) => ({
  width: 30,
  height: 30,
  borderRadius: 15,
  marginHorizontal: 5,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.color.sky_300,
}));

const Icon = styled.Image(({ theme }) => ({
  width: 15,
  height: 15,
  tintColor: theme.color.white,
}));

interface IActionButton {
  onPress: () => void;
}
function ActionButton({ onPress }: IActionButton) {
  const theme = useTheme();

  return (
    <ButtonContainer onPress={onPress} hitSlop={5}>
      <Icon source={theme.icon.add} />
    </ButtonContainer>
  );
}

export default memo(ActionButton);
