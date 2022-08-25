import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { signInAnonymously } from 'firebase/auth';

import { store } from './src/redux/store';
import Main from './Main';
import { auth } from './src/firebase/config';

function App() {
  useEffect(() => {
    (async () => {
      const { user } = await signInAnonymously(auth);

      console.log(user);
    })();
  }, []);

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

export default App;
