import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { Provider } from 'react-redux';

import { store } from './src/redux/store';
import Main from './Main';

function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      const subscribe = BackHandler.addEventListener(
        'hardwareBackPress',
        () => true
      );

      return () => subscribe.remove();
    }
  }, []);

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

export default App;
