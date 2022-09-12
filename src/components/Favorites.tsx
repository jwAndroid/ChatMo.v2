import React, { memo, useCallback, useMemo } from 'react';
import { FlatList, LayoutAnimation, ListRenderItem } from 'react-native';

import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { fulfilled } from '../redux/posts/slice';
import { onFavoritesRoom } from '../firebase/posts';
import { RoomEntity } from '../../types';
import ShadowCard from './ShadowCard';
import { getTimestamp } from '../utils/date';
import { fromUpdate } from '../redux/system/slice';
import useStack from '../hooks/useStack';

interface IFavorites {
  rooms: RoomEntity[] | null;
}

function Favorites({ rooms }: IFavorites) {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  // const navigation = useNavigation<RootStackNavigationProp>();

  const { navigation } = useStack();

  const data = useMemo(
    () =>
      rooms
        ?.filter((room) => room.isFavorites)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [rooms]
  );

  const animationConfig = useMemo(
    () => ({
      duration: 300,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        duration: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    }),
    []
  );

  const key = useCallback((item: RoomEntity) => `${item.roomId}`, []);

  const onPressFavorit = useCallback(
    (item: RoomEntity) => () => {
      if (user && item && rooms) {
        const updatedRooms = rooms.map((post) =>
          post.roomId === item.roomId
            ? {
                ...post,
                isFavorites: !item.isFavorites,
                updatedAt: getTimestamp(),
              }
            : post
        );

        dispatch(fulfilled(updatedRooms));

        onFavoritesRoom(user.userId, item);

        LayoutAnimation.configureNext(animationConfig);
      }
    },
    [dispatch, rooms, user, animationConfig]
  );

  const onPressCard = useCallback(
    (item: RoomEntity) => () => {
      if (item && item.password) {
        navigation.navigate('Pin', item);

        dispatch(fromUpdate({ from: 'Room' }));
      } else {
        navigation.navigate('Room', item);
      }
    },
    [dispatch, navigation]
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
      data={data}
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
