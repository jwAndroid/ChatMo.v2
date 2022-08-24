import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@emotion/react';

import RootStack from './src/navigation/RootStack';
import { RootState } from './src/redux/rootReducer';
import { darkTheme, lightTheme } from './src/theme';

function Main() {
  const systemTheme = useSelector((state: RootState) => state.system.isDark);

  return (
    <ThemeProvider theme={systemTheme ? darkTheme : lightTheme}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default memo(Main);
