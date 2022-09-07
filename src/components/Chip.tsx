import React, { memo } from 'react';
import styled from '@emotion/native';

interface IStyledChip {
  isRow?: boolean;
}
const StyledChip = styled.View<IStyledChip>(({ isRow, theme }) => ({
  flexDirection: isRow ? 'row' : undefined,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 12,
  borderWidth: 1,
  marginLeft: 5,
  borderColor: theme.color.chip,
}));

interface IChip {
  children?: React.ReactNode;
  isRow?: boolean;
}
function Chip({ children, isRow }: IChip) {
  return <StyledChip isRow={isRow}>{children}</StyledChip>;
}

Chip.defaultProps = {
  children: null,
  isRow: false,
};

export default memo(Chip);
