import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  collection,
  DocumentData,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { RootState } from '../redux/rootReducer';
import { firestore } from '../firebase/config';
import { fulfilled } from '../redux/posts/slice';
import { Post } from '../redux/posts/type';

export function useRoomsSnapshotEffect() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

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

          dispatch(fulfilled(document as Post[]));
        }
      );

      return () => unsubscribe();
    }
  }, [dispatch, user]);
}

export function useRoomsLoadEffect() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);

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

        dispatch(fulfilled(document as Post[]));
      }
    })();
  }, [dispatch, user]);
}
