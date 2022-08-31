import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Post } from '../redux/posts/type';
import { fulfilled } from '../redux/posts/slice';
import { RootState } from '../redux/rootReducer';
import { onFavoritesRoom } from '../firebase/posts';
import { RoomEntity } from '../../types';
import ShadowCard from './ShadowCard';

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

  const onPressCard = useCallback(
    (item: RoomEntity) => () => {
      console.log(item);
    },
    []
  );

  const renderItem = useCallback<ListRenderItem<RoomEntity>>(
    ({ item }) => (
      <ShadowCard
        item={item}
        onPressCard={onPressCard}
        onPressFavorit={onPressFavorit}
      />
    ),
    [onPressCard, onPressFavorit]
  );

  return (
    <FlatList
      data={rooms?.filter((room) => room.isFavorites)}
      contentContainerStyle={{ marginLeft: 6 }}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={key}
      renderItem={renderItem}
      initialNumToRender={2}
    />
  );
}

export default memo(Favorites);
