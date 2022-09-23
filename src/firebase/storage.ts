import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
} from 'firebase/storage';

import { getTimestamp } from '../utils/date';
import { storage } from './config';

export async function uploadStorage(userId: string, uri: string) {
  if (uri && userId) {
    console.log('uploadStorage start');

    const reference = ref(
      storage,
      `users/${userId}/images/${userId}${getTimestamp().toString()}.jpg`
    );

    const img = await fetch(uri);

    const bytes = await img.blob();

    await uploadBytes(reference, bytes);

    const downloadURL = await getDownloadURL(reference);

    return downloadURL;
  }
}

export async function downloadURL(reference: StorageReference) {
  const downloadURL = await getDownloadURL(reference);

  return downloadURL;
}
