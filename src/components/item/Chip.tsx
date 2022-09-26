import React, { memo } from 'react';
import styled from '@emotion/native';

interface IStyledChip {
  isRow?: boolean;
  marginLeft?: number;
}
const StyledChip = styled.Pressable<IStyledChip>(
  ({ isRow, marginLeft, theme }) => ({
    flexDirection: isRow ? 'row' : undefined,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft,
    borderColor: theme.color.chip,
  })
);

interface IChip {
  children?: React.ReactNode;
  isRow?: boolean;
  marginLeft?: number;
  onPress?: () => void;
}
function Chip({ children, marginLeft, isRow, onPress }: IChip) {
  return (
    <StyledChip isRow={isRow} marginLeft={marginLeft} onPress={onPress}>
      {children}
    </StyledChip>
  );
}

Chip.defaultProps = {
  children: null,
  marginLeft: 5,
  isRow: false,
  onPress: null,
};

export default memo(Chip);
