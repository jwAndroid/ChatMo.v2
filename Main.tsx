import React, { memo, useEffect, useLayoutEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@emotion/react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootState } from './src/redux/rootReducer';
import { changeTheme } from './src/redux/system/slice';
import useAuthLoadEffect from './src/hooks/useAuthLoadEffect';
import RootStack from './src/navigation/RootStack';
import themeStorage from './src/storages/themeStorage';
import { cacheFonts, cacheImages } from './src/utils/cache';
import { darkTheme, font, icon, lightTheme } from './src/theme';
import Splash from './Splash';

function Main() {
  const dispatch = useDispatch();

  const systemTheme = useSelector((state: RootState) => state.system.isDark);
  const user = useSelector((state: RootState) => state.auth.user);

  const [appReady, setAppReady] = useState(false);

  useAuthLoadEffect();

  useLayoutEffect(() => {
    (async () => {
      await Promise.all([cacheFonts(font), ...cacheImages(icon)]).then(() => {
        setTimeout(() => {
          setAppReady(true);
        }, 2000);
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

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={systemTheme ? darkTheme : lightTheme}>
        {appReady && user ? (
          <NavigationContainer>
            <StatusBar style={systemTheme ? 'light' : 'dark'} />

            <RootStack />
          </NavigationContainer>
        ) : (
          <Splash />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default memo(Main);
