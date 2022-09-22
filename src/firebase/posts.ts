import {
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  collection,
  orderBy,
} from 'firebase/firestore';

import { firestore } from './config';
import { MessageEntity, RoomEntity } from '../../types';
import { getTimestamp } from '../utils/date';

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

export async function createMessage(
  userId: string,
  roomId: string,
  message: MessageEntity
) {
  console.log('createMessage start');

  if (userId && roomId && message) {
    const reference = doc(
      firestore,
      'posts',
      'users',
      userId,
      'rooms',
      'room',
      roomId,
      'messages',
      message._id.toString()
    );

    await setDoc(reference, message);
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

export async function onModifyRoom(
  userId: string,
  roomId: string,
  room: RoomEntity
) {
  console.log('onModifyRoom start');

  if (userId && room) {
    await updateDoc(
      doc(firestore, 'posts', 'users', userId, 'rooms', 'room', roomId),
      { ...room }
    );
  } else {
    throw new Error('error!');
  }
}

export async function loadPosts(userId: string) {
  if (userId) {
    const ref = query(
      collection(firestore, 'posts', 'users', userId, 'rooms', 'room'),
      orderBy('createdAt', 'desc')
    );

    try {
      const snapshot = await getDocs(ref);

      const posts = snapshot.docs.map((doc) => doc.data() as RoomEntity, []);

      return posts as RoomEntity[];
    } catch (error) {
      Error('some error!');
    }
  }
}
