import React, { memo } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store } from './src/redux/store';
import Main from './Main';

// Published: 2022 10 10

function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <Main />
      </Provider>
    </SafeAreaProvider>
  );
}

export default memo(App);
