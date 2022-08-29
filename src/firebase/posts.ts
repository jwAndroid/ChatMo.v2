import { setDoc, doc } from 'firebase/firestore';

import { RoomEntity } from '../../types';
import { firestore } from './config';

export async function createRoom(userId: string, room: RoomEntity) {
  if (userId && room) {
    const reference = doc(
      firestore,
      'posts',
      'users',
      userId,
      'rooms',
      'room',
      room.roomId
    );

    await setDoc(reference, room);
  } else {
    throw new Error('error!');
  }
}
