import uuid from 'react-native-uuid';
import { ChipEntity } from '../../types';
import historyStorage from './historyStorage';

export default function deduplicationStorage(
  value: string,
  chips: ChipEntity[]
) {
  const prepared = {
    id: uuid.v4().toString(),
    title: value,
  };

  if (prepared.title && prepared.id) {
    const deduplication = [prepared, ...chips].filter(
      (arr, index, callback) =>
        index === callback.findIndex((t) => t.title === arr.title)
    );

    historyStorage.set(deduplication);

    return deduplication;
  }
}

/**
 *   const onEndEditing = useCallback(() => {
    // const prepared = {
    //   id: uuid.v4().toString(),
    //   title: value,
    // };

    // if (prepared.title && prepared.id) {
    //   const deduplication = [prepared, ...chips].filter(
    //     (arr, index, callback) =>
    //       index === callback.findIndex((t) => t.title === arr.title)
    //   );

    //   historyStorage.set(deduplication);

    const deduplication = deduplicationStorage(value, chips);

    if (deduplication) {
      setChips(deduplication);
    }
  }, [value, chips]);
 */
