import { useDispatch } from 'react-redux';

import { onModifyRoom } from '../firebase/posts';
import { fulfilled } from '../redux/posts/slice';
import { RoomEntity } from '../redux/posts/type';

export default function useModify(
  prepared: RoomEntity,
  posts: RoomEntity[],
  params: RoomEntity,
  useId: string
) {
  const dispatch = useDispatch();

  const updatedRooms = posts.map((post) =>
    post.roomId === params.roomId
      ? {
          ...post,
          ...prepared,
        }
      : post
  );

  dispatch(fulfilled(updatedRooms));

  onModifyRoom(useId, { ...prepared });
}
