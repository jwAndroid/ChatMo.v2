import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, ListRenderItem } from 'react-native';
import styled from '@emotion/native';

import { pincodes } from '../utils/pincode';

const Container = styled.View(() => ({
  flex: 1,
}));

const PinCodeContainer = styled.View(() => ({
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 20,
}));

const Cell = styled.View(() => ({
  width: 10,
  height: 10,
  backgroundColor: 'black',
  marginLeft: 1,
}));

interface IPadContainer {
  size: number;
}
const PadContainer = styled.TouchableHighlight<IPadContainer>(({ size }) => ({
  width: size,
  height: size,
  justifyContent: 'center',
  alignItems: 'center',
}));

const NumberPad = styled.Text(({ theme }) => ({
  fontSize: 28,
  fontWeight: '600',
  color: theme.color.text,
}));

interface IPad {
  id: string;
  number: string;
  status: string;
}

interface IPin {
  setPinCode: React.Dispatch<React.SetStateAction<string>>;
}

function Pin({ setPinCode }: IPin) {
  const [pins, setPins] = useState<string[]>([]);

  const size = useMemo(() => Dimensions.get('screen').width / 3, []);

  useEffect(() => {
    if (pins.length === 4) {
      setPinCode(pins.join(''));
    }
  }, [pins, setPinCode]);

  const key = useCallback((item: IPad) => `${item.id}`, []);

  const onPress = useCallback(
    (item: IPad) => () => {
      if (item.status === 'code' && pins.length < 4) {
        setPins([...pins, item.number]);
      } else if (item.status === 'reset') {
        setPins([]);
      } else if (item.status === 'cancel') {
        const prepared = pins.filter((_, index) => index < pins.length - 1);

        setPins(prepared);
      }
    },
    [pins]
  );

  const renderItem = useCallback<ListRenderItem<IPad>>(
    ({ item }) => (
      <PadContainer size={size} onPress={onPress(item)}>
        <NumberPad>{item.number}</NumberPad>
      </PadContainer>
    ),
    [size, onPress]
  );

  return (
    <Container>
      <PinCodeContainer>
        {pins.map((_, index) => (
          <Cell key={`${index + 1}`} />
        ))}
      </PinCodeContainer>

      <FlatList
        data={pincodes}
        keyExtractor={key}
        numColumns={3}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </Container>
  );
}

export default memo(Pin);
