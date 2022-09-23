import React, { memo } from 'react';
// import { Provider } from 'react-redux';

// import { store } from './src/redux/store';
// import Main from './Main';
import { CameraModal } from './src/components';

function App() {
  return (
    <CameraModal />
    // <Provider store={store}>
    //   <Main />
    // </Provider>
  );
}

export default memo(App);
