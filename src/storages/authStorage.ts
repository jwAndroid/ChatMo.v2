import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserEntity } from '../../types';
import { userStorageKey } from '../utils/constants';

const authStorage = {
  async get() {
    const rawData = await AsyncStorage.getItem(userStorageKey);

    if (!rawData) {
      return null;
    }

    try {
      const data: UserEntity = JSON.parse(rawData);

      return data;
    } catch (error) {
      return null;
    }
  },
  set(user: UserEntity) {
    return AsyncStorage.setItem(userStorageKey, JSON.stringify(user));
  },
};

export default authStorage;
