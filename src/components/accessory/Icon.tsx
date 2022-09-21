import React, { memo } from 'react';
import { ImageSourcePropType, Pressable } from 'react-native';
import styled from '@emotion/native';

interface IStyledIcon {
  size: number;
  tintColor: string;
  marginLeft?: number;
  marginBottom?: number;
  marginRight?: number;
  marginTop?: number;
}
const StyledIcon = styled.Image<IStyledIcon>(
  ({ size, tintColor, marginLeft, marginBottom, marginRight, marginTop }) => ({
    width: size,
    height: size,
    tintColor,
    marginLeft,
    marginBottom,
    marginRight,
    marginTop,
  })
);

const StyledPressable = styled.TouchableOpacity(({ theme }) => ({
  width: 30,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 15,
  backgroundColor: theme.color.chip,
}));

interface IIcon {
  size: number;
  tintColor: string;
  source: ImageSourcePropType;
  marginLeft?: number;
  marginBottom?: number;
  marginRight?: number;
  marginTop?: number;
  isCircle?: boolean;
  onPress: () => void;
}
function Icon({
  size,
  tintColor,
  marginLeft,
  marginBottom,
  marginRight,
  marginTop,
  source,
  onPress,
  isCircle,
}: IIcon) {
  return isCircle ? (
    <StyledPressable onPress={onPress}>
      <StyledIcon
        size={size}
        tintColor={tintColor}
        source={source}
        marginLeft={marginLeft}
        marginBottom={marginBottom}
        marginRight={marginRight}
        marginTop={marginTop}
      />
    </StyledPressable>
  ) : (
    <Pressable onPress={onPress} hitSlop={10}>
      <StyledIcon
        size={size}
        tintColor={tintColor}
        source={source}
        marginLeft={marginLeft}
        marginBottom={marginBottom}
        marginRight={marginRight}
        marginTop={marginTop}
      />
    </Pressable>
  );
}

Icon.defaultProps = {
  marginLeft: 0,
  marginTop: 0,
  marginBottom: 0,
  marginRight: 0,
  isCircle: false,
};

export default memo(Icon);
