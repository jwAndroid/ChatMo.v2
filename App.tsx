import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@emotion/react';

import { lightTheme } from './src/theme';
import RootStack from './src/navigation/RootStack';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
