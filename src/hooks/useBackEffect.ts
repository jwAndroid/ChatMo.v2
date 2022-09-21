import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function useBackEffect() {
  useEffect(() => {
    const handler = BackHandler.addEventListener(
      'hardwareBackPress',
      () =>
        // some todo navigation back actions
        true
    );

    return () => handler.remove();
  }, []);
}
