import AsyncStorage from '@react-native-async-storage/async-storage';

const key = 'APP_AUTH';

const themeStorage = {
  async get() {
    const rawData = await AsyncStorage.getItem(key);

    if (rawData === 'true') {
      return true;
    }

    return false;
  },
  set(uid: string) {
    return AsyncStorage.setItem(key, uid);
  },
};

export default themeStorage;
