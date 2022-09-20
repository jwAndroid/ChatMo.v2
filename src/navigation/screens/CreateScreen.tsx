import React, { memo, useCallback } from 'react';
import { View, Text } from 'react-native';
import uuid from 'react-native-uuid';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fulfilled } from '../../redux/posts/slice';
import { createRoom } from '../../firebase/posts';
import { getTimestamp } from '../../utils/date';
import useBackEffect from '../../hooks/useBackEffect';

function CreateScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);

  const onCreate = useCallback(() => {
    const room = {
      roomId: uuid.v4().toString(),
      title: posts.data?.length.toString() ?? '1',
      lastMemo: null,
      memoCount: null,
      isFavorites: false,
      isCompleate: false,
      isLock: false,
      password: null,
      createdAt: getTimestamp(),
      updatedAt: 0,
      modifyAt: null,
      chips: [],
    };

    if (user && posts.data) {
      createRoom(user.userId, room);

      dispatch(fulfilled([room, ...posts.data]));
    }
  }, [dispatch, user, posts.data]);

  useBackEffect();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 20 }} onPress={onCreate}>
        onCreate
      </Text>
    </View>
  );
}

export default memo(CreateScreen);
