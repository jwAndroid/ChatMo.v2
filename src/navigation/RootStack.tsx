import React, { memo, useMemo } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
  OTPScreen,
  RoomScreen,
  RoomsScreen,
  SettingScreen,
  ThemeScreen,
} from './screens';
import { RoomEntity } from '../../types';

export type RootStackParamList = {
  Rooms: undefined;
  Setting: undefined;
  Room: RoomEntity | undefined;
  Theme: undefined;
  OTP: RoomEntity | undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  const screenOptions = useMemo<NativeStackNavigationOptions>(
    () => ({
      headerShown: false,
      gestureEnabled: false,
    }),
    []
  );

  return (
    <Navigator screenOptions={screenOptions}>
      <Screen name="Rooms" component={RoomsScreen} />

      <Screen
        name="Setting"
        component={SettingScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Screen
        name="Room"
        component={RoomScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Screen
        name="Theme"
        component={ThemeScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Screen
        name="OTP"
        component={OTPScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Navigator>
  );
}

export default memo(RootStack);
