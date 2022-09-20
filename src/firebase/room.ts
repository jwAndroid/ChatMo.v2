import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { IMessage } from 'react-native-gifted-chat';

import { firestore } from './config';

export async function loadRoom(userId: string, roomId: string) {
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

    return snapshot.docs.map((doc) => doc.data() as IMessage, []);
  }
}
