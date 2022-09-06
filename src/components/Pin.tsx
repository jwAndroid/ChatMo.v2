import React, { memo, useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, ListRenderItem } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import { keypads } from '../utils/keypads';

const size = Dimensions.get('screen').width / 3;
const center = Dimensions.get('screen').width / 2.5;
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
  height: 40,
  marginTop: 10,
  marginBottom: -30,
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 20,
  marginLeft: center,
}));

const Cell = styled.View(({ theme }) => ({
  width: 10,
  height: 10,
  borderWidth: 0.5,
  borderColor: theme.color.icon,
  backgroundColor: theme.color.pin,
  borderRadius: 5,
  marginHorizontal: 5,
}));

const DefaultCell = styled.View(({ theme }) => ({
  width: 10,
  height: 10,
  borderWidth: 0.5,
  borderColor: theme.color.icon,
  backgroundColor: theme.color.background,
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
    fontSize: 25,
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

const DefaultCellContainer = styled.View(() => ({
  position: 'absolute',
  flexDirection: 'row',
}));

interface IPin {
  setPinCode: React.Dispatch<React.SetStateAction<string>>;
}

function Pin({ setPinCode }: IPin) {
  const theme = useTheme();

  const [pins, setPins] = useState<string[]>([]);

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
    [onPress, theme]
  );

  return (
    <Container>
      <PinCodeContainer>
        <DefaultCellContainer>
          {['', '', '', ''].map((_, index) => (
            <DefaultCell key={`${index + 1}`} />
          ))}
        </DefaultCellContainer>

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
