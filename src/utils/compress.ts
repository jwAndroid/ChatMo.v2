import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export async function compressed(imageSource: string) {
  const result = await manipulateAsync(
    imageSource,
    [{ resize: { width: 500 } }],
    { base64: false, compress: 0.9, format: SaveFormat.JPEG }
  );

  return result.uri;
}
