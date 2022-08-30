import React, { memo, useCallback } from 'react';
import { Text, FlatList, ListRenderItem } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/native';

import { Post } from '../redux/posts/type';
import { fulfilled } from '../redux/posts/slice';
import { RootState } from '../redux/rootReducer';
import { onFavoritesRoom } from '../firebase/posts';
import { RoomEntity } from '../../types';

const Container = styled.View(() => ({
  flex: 1,
  backgroundColor: 'gray',
}));

interface IFavorites {
  rooms: Post[] | null;
}

function Favorites({ rooms }: IFavorites) {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

  const key = useCallback((item: RoomEntity) => `${item.roomId}`, []);

  const onPressFavorit = useCallback(
    (item: RoomEntity) => () => {
      if (user && item && rooms) {
        const updatedRooms = rooms.map((post) =>
          post.roomId === item.roomId
            ? {
                ...post,
                isFavorites: !item.isFavorites,
              }
            : post
        );

        dispatch(fulfilled(updatedRooms));

        onFavoritesRoom(user.userId, item);
      }
    },
    [dispatch, rooms, user]
  );

  const renderItem = useCallback<ListRenderItem<RoomEntity>>(
    ({ item }) => (
      <Container>
        <Text style={{ marginLeft: 15 }} onPress={onPressFavorit(item)}>
          {item.title}
        </Text>
      </Container>
    ),
    [onPressFavorit]
  );

  return (
    <FlatList
      data={rooms?.filter((room) => room.isFavorites)}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={key}
      renderItem={renderItem}
    />
  );
}

export default memo(Favorites);
