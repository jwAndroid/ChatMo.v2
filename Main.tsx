import React, { memo, useLayoutEffect, useState } from 'react';
import { ThemeProvider } from '@emotion/react';
import { NavigationContainer } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import NetInfo from '@react-native-community/netinfo';

import { useAppDispatch, useAppSelector } from './src/hooks/useRedux';
import useAuthLoadEffect from './src/hooks/useAuthLoadEffect';
import { changeTheme } from './src/redux/system/slice';
import themeStorage from './src/storages/themeStorage';
import RootStack from './src/navigation/RootStack';
import { cacheImages } from './src/utils/cache';
import { darkTheme, font, icon, lightTheme } from './src/theme';
import Splash from './Splash';
import { ToastModal } from './src/components/modal';

function Main() {
  const dispatch = useAppDispatch();

  const isDark = useAppSelector((state) => state.system.isDark);
  const user = useAppSelector((state) => state.auth.user);

  const [appReady, setAppReady] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const [loaded] = useFonts(font);

  useAuthLoadEffect();

  useLayoutEffect(() => {
    (async () => {
      const storage = await themeStorage.get();

      dispatch(changeTheme({ isDark: storage }));

      await SystemUI.setBackgroundColorAsync(storage ? '#000000' : '#ffffff');
    })();
  }, [dispatch]);

  useLayoutEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state && state.isConnected !== null) {
        setIsConnected(state.isConnected);
      }
    });

    return () => unsubscribe();
  }, [isConnected]);

  useLayoutEffect(() => {
    if (cacheImages(icon).length > 0 && loaded) {
      setTimeout(() => {
        setAppReady(true);
      }, 1500);
    }
  }, [loaded]);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      {appReady &&
      user &&
      user !== null &&
      isConnected &&
      isConnected !== null ? (
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
