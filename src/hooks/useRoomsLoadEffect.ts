import { useCallback, useEffect, useState } from 'react';
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
} from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { useAppDispatch, useAppSelector } from './useRedux';

import { fulfilled } from '../redux/posts/slice';
import { RoomEntity } from '../redux/posts/type';

export function useRoomsLoadEffect() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);

  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData>>();
  const [isloadFirst, setIsloadFirst] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      console.log('useRoomsLoadEffect start');

      if (user) {
        const ref = query(
          collection(firestore, 'posts', 'users', user.userId, 'rooms', 'room'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );

        const snapshot = await getDocs(ref);

        const first = snapshot.docs.map((doc) => doc.data() as RoomEntity, []);

        dispatch(fulfilled(first));

        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

        setIsLoading(false);

        if (first) {
          setIsloadFirst(true);
        }
      }
    })();
  }, [dispatch, user]);

  const onLoadMore = useCallback(async () => {
    if (!!lastDoc && user && posts.data) {
      setIsLoading(true);

      const next = query(
        collection(firestore, 'posts', 'users', user.userId, 'rooms', 'room'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(20)
      );

      const snapshot = await getDocs(next);

      const prepared = snapshot.docs.map((doc) => doc.data() as RoomEntity, []);

      dispatch(fulfilled([...posts.data, ...prepared]));

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      setIsLoading(false);
    }
  }, [dispatch, lastDoc, user, posts.data]);

  return {
    lastDoc,
    isLoading,
    isloadFirst,
    onLoadMore,
  };
}
