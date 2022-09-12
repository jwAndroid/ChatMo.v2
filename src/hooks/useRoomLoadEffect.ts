import { useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { IMessage } from 'react-native-gifted-chat';

import { useAppDispatch, useAppSelector } from './useRedux';
import { firestore } from '../firebase/config';

export function useRoomsSnapshotEffect() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    console.log('useRoomsSnapshotEffect start');

    if (user) {
      const ref = query(
        collection(firestore, 'posts', 'users', user.userId, 'rooms', 'room'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(ref, (snopshot) => {
        const prepared = snopshot.docs.map((doc) => doc.data() as IMessage);
        console.log(prepared);

        // TODO: dispatch message
      });

      return () => unsubscribe();
    }
  }, [dispatch, user]);
}
