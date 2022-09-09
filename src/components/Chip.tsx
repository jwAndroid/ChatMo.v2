import React, { memo } from 'react';
import styled from '@emotion/native';

interface IStyledChip {
  isRow?: boolean;
  marginLeft?: number;
}
const StyledChip = styled.View<IStyledChip>(({ isRow, marginLeft, theme }) => ({
  flexDirection: isRow ? 'row' : undefined,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 3,
  paddingHorizontal: 10,
  borderRadius: 12,
  borderWidth: 1,
  marginLeft,
  borderColor: theme.color.chip,
}));

interface IChip {
  children?: React.ReactNode;
  isRow?: boolean;
  marginLeft?: number;
}
function Chip({ children, marginLeft, isRow }: IChip) {
  return (
    <StyledChip isRow={isRow} marginLeft={marginLeft}>
      {children}
    </StyledChip>
  );
}

Chip.defaultProps = {
  children: null,
  marginLeft: 5,
  isRow: false,
};

export default memo(Chip);
