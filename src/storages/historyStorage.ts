import AsyncStorage from '@react-native-async-storage/async-storage';

import { ChipEntity } from '../../types';

const key = 'logs';

const historyStorage = {
  async get() {
    try {
      const raw = await AsyncStorage.getItem(key);

      if (!raw) {
        throw new Error('No saved data');
      }

      const parsed = JSON.parse(raw);

      return parsed;
    } catch (e) {
      throw new Error('Failed to load');
    }
  },
  async set(data: ChipEntity[]) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      throw new Error('Failed to save');
    }
  },
};

export default historyStorage;
