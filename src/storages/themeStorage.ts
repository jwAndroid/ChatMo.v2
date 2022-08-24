import AsyncStorage from '@react-native-async-storage/async-storage';

const key = 'APP_THEME';

const themeStorage = {
  async get() {
    const rawData = await AsyncStorage.getItem(key);

    if (rawData === 'true') {
      return true;
    }

    return false;
  },
  set(value: string) {
    return AsyncStorage.setItem(key, value);
  },
};

export default themeStorage;
