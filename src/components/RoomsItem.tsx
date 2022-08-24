import React, { memo } from 'react';
import { Text } from 'react-native';

import { RoomsEntity } from '../../types';
import { ellipsize } from '../utils/ellipsize';

interface IRoomsItem {
  item: RoomsEntity;
}

function RoomsItem({ item }: IRoomsItem) {
  const { title } = item;

  return <Text>{ellipsize(title, 20)}</Text>;
}

export default memo(RoomsItem);
