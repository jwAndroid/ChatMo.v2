import { setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

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

export async function deleteRoom(userId: string, roomId: string) {
  if (userId && roomId) {
    await deleteDoc(
      doc(firestore, 'posts', 'users', userId, 'rooms', 'room', roomId)
    );
  } else {
    throw new Error('error!');
  }
}

export async function onFavoritesRoom(userId: string, room: RoomEntity) {
  if (userId && room) {
    console.log(room.roomId);
    await updateDoc(
      doc(firestore, 'posts', 'users', userId, 'rooms', 'room', room.roomId),
      { isFavorites: !room.isFavorites }
    );
  } else {
    throw new Error('error!');
  }
}
