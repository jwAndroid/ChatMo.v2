import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import React, { memo } from 'react';
import { Dimensions, Platform, Pressable } from 'react-native';

import { RoomEntity } from '../../types';
import { getFormatTime } from '../utils/date';
import { ellipsize } from '../utils/ellipsize';
import { lineBreak } from '../utils/text';
import CommonText from './CommonText';

const { width, height } = Dimensions.get('screen');

const ShadowContainer = styled.Pressable(({ theme }) => {
  const shadow = Platform.select({
    ios: {
      shadowColor: theme.color.shadow,
      shadowOffset: {
        width: 1,
        height: 2,
      },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    android: {
      elevation: 7,
      shadowColor: theme.color.shadow,
    },
  });

  return {
    width: width / 1.6,
    height: height / 6.3,
    marginVertical: 3,
    marginHorizontal: 6,
    borderRadius: 10,
    backgroundColor: theme.color.card,
    ...shadow,
  };
});

const TitleContainer = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginHorizontal: 10,
  marginVertical: 5,
}));

interface IIcon {
  size: number;
  tintColor: string;
}

const Icon = styled.Image<IIcon>(({ size, tintColor }) => ({
  width: size,
  height: size,
  tintColor,
}));

const ContentsContainer = styled.View(() => ({
  flex: 1,
  flexDirection: 'row',
  marginHorizontal: 10,
}));

const LeftContainer = styled.View(() => ({
  flex: 1,
}));

const RightContainer = styled.View(() => ({
  justifyContent: 'flex-end',
  paddingBottom: 10,
}));

const ChipContainer = styled.View(() => ({
  flexDirection: 'row',
  marginTop: 5,
  marginBottom: 2,
}));

const Chip = styled.View(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 12,
  borderWidth: 1,
  marginLeft: 6,
  borderColor: theme.color.chip,
}));

interface IShadowCard {
  item: RoomEntity;
  onPressCard: (item: RoomEntity) => () => void;
  onPressFavorit: (item: RoomEntity) => () => void;
}

function ShadowCard({ item, onPressCard, onPressFavorit }: IShadowCard) {
  const theme = useTheme();

  return (
    <ShadowContainer onPress={onPressCard(item)}>
      <TitleContainer>
        <CommonText text={ellipsize(item.title, 10)} fontSize={15} />

        {item.isLock ? (
          <Icon
            size={13}
            tintColor={theme.color.red}
            source={theme.icon.lock}
          />
        ) : null}
      </TitleContainer>

      <CommonText
        text={getFormatTime(item.createdAt, true)}
        fontSize={12}
        marginLeft={10}
      />
      {item.chips ? (
        <ChipContainer>
          {item.chips.map((chip) => (
            <Chip key={chip.id}>
              <CommonText text={ellipsize(chip.title, 10)} fontSize={12} />
            </Chip>
          ))}
        </ChipContainer>
      ) : null}

      <ContentsContainer>
        <LeftContainer>
          <CommonText
            text={lineBreak(ellipsize(item.lastMemo, 30))}
            fontSize={17}
          />
        </LeftContainer>

        <RightContainer>
          <Pressable
            style={({ pressed }) => pressed && { opacity: 0.75 }}
            onPress={onPressFavorit(item)}
            hitSlop={10}
          >
            <Icon
              size={20}
              tintColor={theme.color.chip}
              source={theme.icon.favoritesfill}
            />
          </Pressable>
        </RightContainer>
      </ContentsContainer>
    </ShadowContainer>
  );
}

export default memo(ShadowCard);
