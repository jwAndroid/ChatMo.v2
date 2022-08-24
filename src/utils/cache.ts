import { Image } from 'react-native';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

export const cacheFonts = (font: { [fontFamily: string]: Font.FontSource }) =>
  Font.loadAsync(font);

export const cacheImages = (source: { [name: string]: string | number }) =>
  Object.values(source).map((value) =>
    typeof value === 'string'
      ? Image.prefetch(value)
      : Asset.fromModule(value).downloadAsync()
  );
