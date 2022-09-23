import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './config';

export async function uploadStorage(userId: string, source: string) {
  if (userId && source) {
    console.log('uploadStorage start');

    const reference = ref(storage, 'image.jpg');

    const img = await fetch(source);

    const bytes = await img.blob();

    await uploadBytes(reference, bytes)
      .then(
        () => {},
        (compleated) => {
          if (compleated) {
            console.log(`compleated : ${compleated}`);
          }
        }
      )
      .catch((e) => {
        console.log(e);
      });
  }
}

export async function downloadURL() {
  const reference = ref(storage, 'image.jpg');

  if (reference) {
    getDownloadURL(reference).then((url) => {
      console.log(url);

      return url;
    });
  }
}
