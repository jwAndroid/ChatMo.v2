import { useEffect } from 'react';
import uuid from 'react-native-uuid';

import { useAppDispatch } from './useRedux';
import { authorize } from '../redux/auth/slice';
import { authorization } from '../firebase/auth';
import authStorage from '../storages/authStorage';
import { UserEntity } from '../../types';
import { getTimestamp } from '../utils/date';

export default function useAuthLoadEffect() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const auth = await authStorage.get();

      console.log(`user: ${JSON.stringify(auth, null, 5)}`);

      if (!auth || auth === null || auth === undefined) {
        const user: UserEntity = {
          userId: uuid.v4().toString(),
          createdAt: getTimestamp(),
          status: 1,
        };

        authStorage.set(user);

        dispatch(authorize(user));

        authorization(user.userId, user);
      } else {
        dispatch(authorize(auth));
      }
    })();
  }, [dispatch]);
}
