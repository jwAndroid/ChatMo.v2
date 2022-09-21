import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

import { MessageEntity, RoomEntity } from '../../types';
import { firestore } from './config';

export async function loadMessages(userId: string, roomId: string) {
  if (userId) {
    const ref = query(
      collection(
        firestore,
        'posts',
        'users',
        userId,
        'rooms',
        'room',
        roomId,
        'messages'
      ),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(ref);

    return snapshot.docs.map((doc) => doc.data() as MessageEntity, []);
  }
}

export async function onModifyMessage(
  userId: string,
  room: RoomEntity,
  message: MessageEntity
) {
  console.log('onModifyMessage start');

  if (userId && room && message) {
    await updateDoc(
      doc(
        firestore,
        'posts',
        'users',
        userId,
        'rooms',
        'room',
        room.roomId,
        'messages',
        message._id.toString()
      ),
      { ...message }
    );
  } else {
    console.log('onModifyMessage error!');
  }
}

export async function deleteMessage(
  userId: string,
  room: RoomEntity,
  message: MessageEntity
) {
  console.log('deleteMessage start');

  if (userId && room && message) {
    await deleteDoc(
      doc(
        firestore,
        'posts',
        'users',
        userId,
        'rooms',
        'room',
        room.roomId,
        'messages',
        message._id.toString()
      )
    );
  } else {
    console.log('onModifyMessage error!');
  }
}
