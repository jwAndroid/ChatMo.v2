import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@emotion/react';

import { RootState } from './src/redux/rootReducer';
import RootStack from './src/navigation/RootStack';
import { darkTheme, lightTheme } from './src/theme';
import themeStorage from './src/storages/themeStorage';
import { changeTheme } from './src/redux/system/slice';

function Main() {
  const dispatch = useDispatch();

  const systemTheme = useSelector((state: RootState) => state.system.isDark);

  useEffect(() => {
    (async () => {
      const storage = await themeStorage.get();

      if (storage) {
        dispatch(changeTheme({ isDark: true }));
      } else {
        dispatch(changeTheme({ isDark: false }));
      }
    })();
  }, [dispatch]);

  return (
    <ThemeProvider theme={systemTheme ? darkTheme : lightTheme}>
      {/* Todo: SplashScreen */}
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default memo(Main);
