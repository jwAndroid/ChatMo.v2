import { doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import uuid from 'react-native-uuid';
import { useAppDispatch } from './useRedux';

import { UserEntity } from '../../types';
import { firestore } from '../firebase/config';
import { authorize } from '../redux/auth/slice';
import authStorage from '../storages/authStorage';
import { getTimestamp } from '../utils/date';

export default function useAuthLoadEffect() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const auth = await authStorage.get();

      console.log(auth);

      if (!auth) {
        const user: UserEntity = {
          userId: uuid.v4().toString(),
          createdAt: getTimestamp(),
          status: 1,
        };
        authStorage.set(user);

        dispatch(authorize(user));

        await setDoc(doc(firestore, 'user', user.userId), user);
      } else {
        dispatch(authorize(auth));
      }
    })();
  }, [dispatch]);
}
