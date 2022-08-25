import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@emotion/react';

import { RootState } from './src/redux/rootReducer';
import { changeTheme } from './src/redux/system/slice';
import RootStack from './src/navigation/RootStack';
import { darkTheme, font, icon, lightTheme } from './src/theme';
import themeStorage from './src/storages/themeStorage';
import { cacheFonts, cacheImages } from './src/utils/cache';
import Splash from './Splash';
import useAuthLoadEffect from './src/hooks/useAuthLoadEffect';

function Main() {
  const dispatch = useDispatch();

  const systemTheme = useSelector((state: RootState) => state.system.isDark);
  const user = useSelector((state: RootState) => state.auth.user);

  const [cacheReady, setCacheReady] = useState(false);

  useAuthLoadEffect();

  useEffect(() => {
    (async () => {
      await Promise.all([cacheFonts(font), ...cacheImages(icon)]).then(() => {
        setTimeout(() => {
          setCacheReady(true);
        }, 2000);
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const storage = await themeStorage.get();

      if (storage) {
        dispatch(changeTheme({ isDark: true }));

        await SystemUI.setBackgroundColorAsync('#000');
      } else {
        dispatch(changeTheme({ isDark: false }));

        await SystemUI.setBackgroundColorAsync('#fff');
      }
    })();
  }, [dispatch]);

  return (
    <ThemeProvider theme={systemTheme ? darkTheme : lightTheme}>
      {cacheReady && user ? (
        <NavigationContainer>
          <StatusBar style={systemTheme ? 'light' : 'dark'} />

          <RootStack />
        </NavigationContainer>
      ) : (
        <Splash />
      )}
    </ThemeProvider>
  );
}

export default memo(Main);
