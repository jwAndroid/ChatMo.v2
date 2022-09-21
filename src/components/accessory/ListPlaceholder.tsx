import React, { memo, useCallback, useMemo } from 'react';
import styled from '@emotion/native';
import {
  Dimensions,
  FlatList,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

const { width } = Dimensions.get('screen');

const Container = styled.View(() => ({
  padding: 15,
}));

const RightContainer = styled.View(() => ({
  justifyContent: 'center',
  alignItems: 'center',
}));

const LeftContainer = styled.View(() => ({
  justifyContent: 'center',
}));

interface IStyledPlaceholderLine {
  width: number;
}
const StyledPlaceholderLine = styled(PlaceholderLine)<IStyledPlaceholderLine>(
  ({ theme, width }) => ({
    width,
    height: 15,
    backgroundColor: theme.color.placeholder,
  })
);

function ListPlaceholder() {
  const style = useMemo<StyleProp<ViewStyle>>(
    () => ({
      marginTop: 10,
    }),
    []
  );

  const keyExtractor = useCallback(
    (item: { key: string }) => `${item.key}`,
    []
  );

  const renderRight = useCallback<React.ComponentType<ViewProps>>(
    () => (
      <RightContainer>
        <StyledPlaceholderLine width={40} />

        <StyledPlaceholderLine width={15} />
      </RightContainer>
    ),
    []
  );

  const renderLeft = useCallback<React.ComponentType<ViewProps>>(
    () => (
      <LeftContainer>
        <StyledPlaceholderLine width={width / 1.5} />

        <StyledPlaceholderLine width={width / 3} />
      </LeftContainer>
    ),
    []
  );

  const renderItem = useCallback(
    () => (
      <Placeholder
        Left={renderLeft}
        Right={renderRight}
        Animation={Fade}
        style={style}
      />
    ),
    [renderLeft, renderRight, style]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 80,
      offset: 80 * index,
      index,
    }),
    []
  );

  return (
    <Container>
      <FlatList
        data={Array(15)
          .fill('')
          .map((_, i) => ({ key: `${i}` }))}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={17}
        getItemLayout={getItemLayout}
        removeClippedSubviews
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

export default memo(ListPlaceholder);
