import { useEffect } from 'react';
import uuid from 'react-native-uuid';
import { useDispatch } from 'react-redux';

import { UserEntity } from '../../types';
import { authorize } from '../redux/auth/slice';
import authStorage from '../storages/authStorage';
import { getTimestamp } from '../utils/date';

export default function useAuthLoadEffect() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const auth = await authStorage.get();

      if (!auth) {
        const user: UserEntity = {
          userId: uuid.v4().toString(),
          createdAt: getTimestamp(),
          status: 1,
        };

        authStorage.set(user);
      } else {
        dispatch(authorize(auth));
      }
    })();
  }, [dispatch]);
}
