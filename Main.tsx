import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as SystemUI from 'expo-system-ui';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@emotion/react';

import { RootState } from './src/redux/rootReducer';
import { changeTheme } from './src/redux/system/slice';
import RootStack from './src/navigation/RootStack';
import { darkTheme, font, icon, lightTheme } from './src/theme';
import themeStorage from './src/storages/themeStorage';
import { cacheFonts, cacheImages } from './src/utils/cache';
import Splash from './Splash';

function Main() {
  const dispatch = useDispatch();

  const systemTheme = useSelector((state: RootState) => state.system.isDark);

  const [isReady, setIsReady] = useState(false);
  const [cacheReady, setCacheReady] = useState(false);

  useEffect(() => {
    (async () => {
      await Promise.all([cacheFonts(font), ...cacheImages(icon)]).then(() => {
        setCacheReady(true);
      });
    })();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (cacheReady) {
        setIsReady(true);
      }
    }, 2000);
  }, [cacheReady]);

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
      {isReady ? (
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      ) : (
        <Splash />
      )}
    </ThemeProvider>
  );
}

export default memo(Main);
