import React, { memo, useCallback, useEffect, useState } from 'react';
import { Animated } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fulfilled } from '../../redux/posts/slice';
import { deleteRoom } from '../../firebase/posts';
import { useAnimation } from '../../hooks/useAnimation';
import useBackEffect from '../../hooks/useBackEffect';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { IconHeader, Pin, SafeAreaContainer } from '../../components';

interface IIcon {
  isInvailed: boolean;
}
const Icon = styled.Image<IIcon>(({ theme, isInvailed }) => ({
  width: 80,
  height: 80,
  tintColor: isInvailed ? theme.color.red : theme.color.icon,
  alignSelf: 'center',
}));

type PinScreenRouteProp = RouteProp<RootStackParamList, 'Pin'>;

function PinScreen() {
  const dispatch = useAppDispatch();

  const from = useAppSelector((state) => state.system.from);
  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);

  const theme = useTheme();

  const navigation = useNavigation<RootStackNavigationProp>();

  const { params } = useRoute<PinScreenRouteProp>();

  const { shake, style } = useAnimation();

  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState(false);

  useBackEffect();

  useEffect(() => {
    if (params && pinCode !== '' && from !== '' && posts.data && user) {
      if (params.password === pinCode) {
        if (from === 'Form') {
          navigation.navigate('Form', params);
        } else if (from === 'Room') {
          navigation.navigate('Room', params);
        } else if (from === 'Delete') {
          const prepared = posts.data.filter(
            (post) => post.roomId !== params.roomId
          );

          deleteRoom(user.userId, params.roomId);

          dispatch(fulfilled(prepared));

          navigation.goBack();
        }
      } else {
        shake();

        setError(true);
      }
    }
  }, [dispatch, posts.data, user, pinCode, navigation, from, shake, params]);

  const onBackPress = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  return (
    <SafeAreaContainer>
      <IconHeader isBackword onPress={onBackPress} />

      <Animated.View style={style}>
        <Icon isInvailed={error} source={theme.icon.lock} />
      </Animated.View>

      <Pin setPinCode={setPinCode} setError={setError} />
    </SafeAreaContainer>
  );
}

export default memo(PinScreen);
