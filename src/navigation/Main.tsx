import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@emotion/react';

import RootStack from './RootStack';
import { RootState } from '../redux/rootReducer';
import { darkTheme, lightTheme } from '../theme';

function Main() {
  const systemTheme = useSelector((state: RootState) => state.system.isDark);
  console.log(`main 에서 시스템 테마: ${systemTheme}`);

  return (
    <ThemeProvider theme={systemTheme ? darkTheme : lightTheme}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default memo(Main);
