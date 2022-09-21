import AsyncStorage from '@react-native-async-storage/async-storage';

import { ChipEntity } from '../../types';

const key = 'logs';

const historyStorage = {
  async get() {
    try {
      const raw = await AsyncStorage.getItem(key);

      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);

      return parsed;
    } catch (e) {
      return null;
    }
  },
  async set(data: ChipEntity[]) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      return null;
    }
  },
};

export default historyStorage;
