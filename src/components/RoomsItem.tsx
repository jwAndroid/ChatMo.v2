import React, { memo } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import CommonText from './CommonText';
import { ellipsize } from '../utils/ellipsize';
import { RoomsEntity } from '../../types';

const Container = styled.View(() => ({
  flex: 1,
  marginHorizontal: 10,
  flexDirection: 'row',
}));

const TitleContainer = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}));

const ContentsContainer = styled.View(() => ({
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: 5,
}));

const CountContainer = styled.View(() => ({
  alignItems: 'center',
  justifyContent: 'center',
}));

const CircleContainer = styled.View(({ theme }) => ({
  width: 16,
  height: 16,
  borderRadius: 5,
  marginTop: 4,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.color.sky_400,
}));

const Icon = styled.Image(({ theme }) => ({
  width: 10,
  height: 10,
  marginLeft: 3,
  tintColor: theme.color.red,
}));

interface IRoomsItem {
  item: RoomsEntity;
}

function RoomsItem({ item }: IRoomsItem) {
  const theme = useTheme();

  const { title, isLock, lastMemo, createdAt, memoCount } = item;

  return (
    <Container>
      <ContentsContainer>
        <TitleContainer>
          <CommonText text={ellipsize(title, 17)} fontSize={16} />

          {isLock && <Icon source={theme.icon.lock} />}
        </TitleContainer>

        <CommonText
          text={ellipsize(lastMemo, 20)}
          fontSize={12}
          marginTop={3}
        />
      </ContentsContainer>

      <CountContainer>
        <CommonText text={createdAt.toString()} fontSize={10} />

        {memoCount && (
          <CircleContainer>
            <CommonText
              text={memoCount.toString()}
              fontSize={12}
              color={theme.color.white}
            />
          </CircleContainer>
        )}
      </CountContainer>
    </Container>
  );
}

export default memo(RoomsItem);
