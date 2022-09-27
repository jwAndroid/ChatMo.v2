import { Image } from 'react-native';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

export function cacheFonts(font: { [fontFamily: string]: Font.FontSource }) {
  return Font.loadAsync(font);
}

export function cacheImages(source: { [name: string]: string | number }) {
  return Object.values(source).map((value) =>
    typeof value === 'string'
      ? Image.prefetch(value)
      : Asset.fromModule(value).downloadAsync()
  );
}
