import { doc, setDoc } from 'firebase/firestore';

import { UserEntity } from '../../types';
import { firestore } from './config';

export async function authorization(userId: string, user: UserEntity) {
  if (user && userId) {
    try {
      const reference = doc(firestore, 'user', userId);

      await setDoc(reference, user);
    } catch (error) {
      throw new Error('Failed authorization');
    }
  }
}
