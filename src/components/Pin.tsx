import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, ListRenderItem } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import { keypads } from '../utils/keypads';

interface IPad {
  id: string;
  number: string;
  status: string;
}

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

interface ICell {
  backgroundColor?: string;
}
const Cell = styled.View<ICell>(({ theme, backgroundColor }) => ({
  width: 10,
  height: 10,
  borderWidth: 0.5,
  borderColor: theme.color.icon,
  backgroundColor,
  borderRadius: 5,
  marginHorizontal: 5,
}));

interface IPadContainer {
  size: number;
}
const PadItemContainer = styled.Pressable<IPadContainer>(({ size }) => ({
  width: size,
  height: size,
  justifyContent: 'center',
  alignItems: 'center',
}));

interface INumberText {
  marginLeft?: number;
  marginRight?: number;
}
const NumberText = styled.Text<INumberText>(
  ({ theme, marginLeft = 0, marginRight = 0 }) => ({
    fontSize: 28,
    fontWeight: '600',
    marginLeft,
    marginRight,
    color: theme.color.text,
  })
);

const Icon = styled.Image(({ theme }) => ({
  width: 35,
  height: 35,
  marginRight: 5,
  tintColor: theme.color.icon,
}));

interface IPin {
  setPinCode: React.Dispatch<React.SetStateAction<string>>;
}

function Pin({ setPinCode }: IPin) {
  const theme = useTheme();

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
      } else if (item.status === 'cancel') {
        const prepared = pins.filter((_, index) => index < pins.length - 1);

        setPins(prepared);
      }
    },
    [pins]
  );

  const renderItem = useCallback<ListRenderItem<IPad>>(
    ({ item, index }) => {
      if (index === 9) {
        return (
          <PadItemContainer size={size}>
            <NumberText />
          </PadItemContainer>
        );
      }

      if (index === 11) {
        return (
          <PadItemContainer size={size} onPress={onPress(item)}>
            <Icon source={theme.icon.cancel} />
          </PadItemContainer>
        );
      }

      return (
        <PadItemContainer size={size} onPress={onPress(item)}>
          <NumberText>{item.number}</NumberText>
        </PadItemContainer>
      );
    },
    [onPress, size, theme]
  );

  return (
    <Container>
      <PinCodeContainer>
        {pins.length === 0
          ? ['', '', '', ''].map((_, index) => <Cell key={`${index + 1}`} />)
          : null}

        {pins.map((_, index) => (
          <Cell key={`${index + 1}`} />
        ))}
      </PinCodeContainer>

      <FlatList
        data={keypads}
        keyExtractor={key}
        numColumns={3}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </Container>
  );
}

export default memo(Pin);
