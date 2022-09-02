import { setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

import { RoomEntity } from '../../types';
import { getTimestamp } from '../utils/date';
import { firestore } from './config';

export async function createRoom(userId: string, room: RoomEntity) {
  console.log('createRoom start');

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
  console.log('deleteRoom start');

  if (userId && roomId) {
    await deleteDoc(
      doc(firestore, 'posts', 'users', userId, 'rooms', 'room', roomId)
    );
  } else {
    throw new Error('error!');
  }
}

export async function onFavoritesRoom(userId: string, room: RoomEntity) {
  console.log('onFavoritesRoom start');

  if (userId && room) {
    await updateDoc(
      doc(firestore, 'posts', 'users', userId, 'rooms', 'room', room.roomId),
      { isFavorites: !room.isFavorites, updatedAt: getTimestamp() }
    );
  } else {
    throw new Error('error!');
  }
}

export async function onModifyRoom(userId: string, room: RoomEntity) {
  console.log('onModifyRoom start');

  if (userId && room) {
    await updateDoc(
      doc(firestore, 'posts', 'users', userId, 'rooms', 'room', room.roomId),
      { ...room }
    );
  } else {
    throw new Error('error!');
  }
}
