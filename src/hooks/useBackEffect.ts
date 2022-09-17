import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export default function useBackEffect() {
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('back swipe event start');

      // some todo navigation back actions
      return true;
    });

    return () => handler.remove();
  }, []);
}
