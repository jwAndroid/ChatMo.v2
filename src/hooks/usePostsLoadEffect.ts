import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';

import { firestore } from '../firebase/config';
import { fulfilled } from '../redux/posts/slice';
import { Post } from '../redux/posts/type';

export default function usePostsLoadEffect() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(firestore, 'posts'), orderBy('createdAt', 'asc')),
      (snopshot) => {
        const document: DocumentData[] = [];

        snopshot.forEach((doc) => {
          document.push(doc.data());
        });

        dispatch(fulfilled(document as Post[]));
      }
    );

    return () => unsubscribe();
  }, [dispatch]);
}
