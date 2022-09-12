import React, { memo, useLayoutEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@emotion/react';

import { useAppDispatch, useAppSelector } from './src/hooks/useRedux';
import useAuthLoadEffect from './src/hooks/useAuthLoadEffect';
import { useRoomsLoadEffect } from './src/hooks/useRoomsLoadEffect';
import { changeTheme } from './src/redux/system/slice';

import RootStack from './src/navigation/RootStack';
import themeStorage from './src/storages/themeStorage';
import { cacheFonts, cacheImages } from './src/utils/cache';
import { darkTheme, font, icon, lightTheme } from './src/theme';
import Splash from './Splash';

function Main() {
  const dispatch = useAppDispatch();

  const isDark = useAppSelector((state) => state.system.isDark);
  const user = useAppSelector((state) => state.auth.user);

  useAuthLoadEffect();
  const { isloadFirst } = useRoomsLoadEffect();

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

      dispatch(changeTheme({ isDark: storage }));

      await SystemUI.setBackgroundColorAsync(storage ? '#000000' : '#ffffff');
    })();
  }, [dispatch]);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      {appReady && user && isloadFirst ? (
        <NavigationContainer>
          <StatusBar style={isDark ? 'light' : 'dark'} />

          <RootStack />
        </NavigationContainer>
      ) : (
        <Splash />
      )}
    </ThemeProvider>
  );
}

export default memo(Main);
