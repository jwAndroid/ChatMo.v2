import React from 'react';
import { Platform, UIManager } from 'react-native';
import { Provider } from 'react-redux';

import { store } from './src/redux/store';
import Main from './Main';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

export default App;
