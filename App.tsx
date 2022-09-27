import React, { memo, useLayoutEffect, useState } from 'react';
import { Provider } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';

import { store } from './src/redux/store';
import Main from './Main';

function App() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state && state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });

    return () => unsubscribe();
  }, [isConnected]);

  return (
    <Provider store={store}>
      <Main isConnected={isConnected} />
    </Provider>
  );
}

export default memo(App);
