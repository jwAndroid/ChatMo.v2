import React, { memo, useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, ListRenderItem, Text, View } from 'react-native';
import styled from '@emotion/native';
import { pincodes } from '../utils/pincode';

const Container = styled.View(() => ({
  flex: 1,
}));

const PasswordContainer = styled.View(() => ({
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 20,
}));

interface IItemContainer {
  size: number;
}
const ItemContainer = styled.View<IItemContainer>(({ size }) => ({
  width: size,
  height: size,
  justifyContent: 'center',
  alignItems: 'center',
}));

const Numberpad = styled.Text(() => ({
  fontSize: 15,
}));

interface IPad {
  id: string;
  number: string;
  status: string;
}

function Pin() {
  const [pins, setPins] = useState<string[]>([]);

  const size = useMemo(() => Dimensions.get('screen').width / 3, []);

  const key = useCallback((item: IPad) => `${item.id}`, []);

  const onPress = useCallback(
    (item: IPad) => () => {
      if (item.status === 'code') {
        setPins([...pins, item.number]);
      } else if (item.status === 'reset') {
        setPins([]);
      } else {
        const prepared = pins.filter((_, index) => index < pins.length - 1);

        setPins(prepared);
      }

      console.log(pins);
    },
    [pins]
  );

  const renderItem = useCallback<ListRenderItem<IPad>>(
    ({ item }) => (
      <ItemContainer size={size}>
        <Numberpad>{item.number}</Numberpad>
      </ItemContainer>
    ),
    [size]
  );

  return (
    <Container>
      <Text>암호 입력</Text>

      <PasswordContainer>
        {pins.map((pin, index) => (
          <Text key={`${index + 1}`}>{pin}</Text>
        ))}
      </PasswordContainer>

      <View
        style={{
          flex: 1,
          backgroundColor: 'gray',
          margin: 20,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {pincodes.map((pincode, index) => (
          <Text style={{ fontSize: 100 }} key={`${index + 1}`}>
            {pincode.number}
          </Text>
        ))}
      </View>
    </Container>
  );
}

export default memo(Pin);
