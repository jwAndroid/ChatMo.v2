import React, { memo, useEffect, useLayoutEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@emotion/react';

import { useAppDispatch, useAppSelector } from './src/hooks/useRedux';
import { changeTheme } from './src/redux/system/slice';
import useAuthLoadEffect from './src/hooks/useAuthLoadEffect';
import RootStack from './src/navigation/RootStack';
import themeStorage from './src/storages/themeStorage';
import { cacheFonts, cacheImages } from './src/utils/cache';
import { darkTheme, font, icon, lightTheme } from './src/theme';
import { useRoomsLoadEffect } from './src/hooks/useRoomsLoadEffect';
import Splash from './Splash';

function Main() {
  const dispatch = useAppDispatch();

  const systemTheme = useAppSelector((state) => state.system.isDark);
  const user = useAppSelector((state) => state.auth.user);

  useAuthLoadEffect();
  const { isLoadData } = useRoomsLoadEffect();

  const [appReady, setAppReady] = useState(false);

  useLayoutEffect(() => {
    (async () => {
      await Promise.all([cacheFonts(font), ...cacheImages(icon)]).then(() => {
        setTimeout(() => {
          setAppReady(true);
        }, 3000);
      });
    })();
  }, []);

  useLayoutEffect(() => {
    (async () => {
      const storage = await themeStorage.get();

      if (storage) {
        dispatch(changeTheme({ isDark: true }));

        await SystemUI.setBackgroundColorAsync('#000000');
      } else {
        dispatch(changeTheme({ isDark: false }));

        await SystemUI.setBackgroundColorAsync('#ffffff');
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      const color = await SystemUI.getBackgroundColorAsync();

      console.log(color);
    })();
  }, []);

  return (
    <ThemeProvider theme={systemTheme ? darkTheme : lightTheme}>
      {appReady && user && isLoadData ? (
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
