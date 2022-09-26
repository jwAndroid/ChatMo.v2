import React, { memo, useLayoutEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@emotion/react';

import { useAppDispatch, useAppSelector } from './src/hooks/useRedux';
import useAuthLoadEffect from './src/hooks/useAuthLoadEffect';
import { changeTheme } from './src/redux/system/slice';

import RootStack from './src/navigation/RootStack';
import themeStorage from './src/storages/themeStorage';
import { cacheFonts, cacheImages } from './src/utils/cache';
import { darkTheme, font, icon, lightTheme } from './src/theme';
import Splash from './Splash';
import { ToastModal } from './src/components/modal';

interface IMain {
  isConnected: boolean | null;
}
function Main({ isConnected }: IMain) {
  const dispatch = useAppDispatch();

  const isDark = useAppSelector((state) => state.system.isDark);
  const user = useAppSelector((state) => state.auth.user);

  useAuthLoadEffect();

  const [appReady, setAppReady] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
      {appReady && user && isConnected ? (
        <NavigationContainer>
          <StatusBar style={isDark ? 'light' : 'dark'} />

          <RootStack />
        </NavigationContainer>
      ) : (
        <Splash />
      )}

      {!isConnected && isConnected !== null && (
        <ToastModal
          text="인터넷 연결을 확인해 주세요."
          showToast={showToast}
          setShowToast={setShowToast}
        />
      )}
    </ThemeProvider>
  );
}

export default memo(Main);
