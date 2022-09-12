import { useEffect, useState } from 'react';
import {
  collection,
  DocumentData,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useAppDispatch, useAppSelector } from './useRedux';

import { fulfilled } from '../redux/posts/slice';
import { RoomEntity } from '../redux/posts/type';
import { firestore } from '../firebase/config';

export function useRoomsSnapshotEffect() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    console.log('useRoomsSnapshotEffect start');

    if (user) {
      const unsubscribe = onSnapshot(
        query(
          collection(firestore, 'posts', 'users', user.userId, 'rooms', 'room'),
          orderBy('createdAt', 'desc')
        ),
        (snopshot) => {
          const document: DocumentData[] = [];

          snopshot.forEach((doc) => {
            document.push(doc.data());
          });

          dispatch(fulfilled(document as RoomEntity[]));
        }
      );

      return () => unsubscribe();
    }
  }, [dispatch, user]);
}

export function useRoomsLoadEffect() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const [isLoadData, setIsLoadData] = useState(false);

  useEffect(() => {
    (async () => {
      if (user) {
        const ref = query(
          collection(firestore, 'posts', 'users', user.userId, 'rooms', 'room'),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(ref);

        const document: DocumentData[] = [];

        querySnapshot.forEach((doc) => {
          document.push(doc.data());
        });

        dispatch(fulfilled(document as RoomEntity[]));

        setIsLoadData(true);
      }
    })();
  }, [dispatch, user]);

  return {
    isLoadData,
  };
}
