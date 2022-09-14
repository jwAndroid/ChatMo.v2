import React, { memo, useMemo } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
  ModifyScreen,
  PinScreen,
  RoomScreen,
  RoomsScreen,
  SearchScreen,
  SettingScreen,
  ThemeScreen,
} from './screens';
import { RoomEntity } from '../../types';

export type RootStackParamList = {
  Rooms: undefined;
  Setting: undefined;
  Room: RoomEntity | undefined;
  Theme: undefined;
  Pin: RoomEntity | undefined;
  Modify: RoomEntity | undefined;
  Search: undefined;
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
    <Navigator screenOptions={screenOptions} initialRouteName="Rooms">
      <Screen name="Rooms" component={RoomsScreen} />

      <Screen
        name="Setting"
        component={SettingScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Screen
        name="Room"
        component={RoomScreen}
        options={{ animation: 'slide_from_right', gestureEnabled: false }}
      />
      <Screen
        name="Theme"
        component={ThemeScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Screen
        name="Pin"
        component={PinScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Screen
        name="Modify"
        component={ModifyScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Screen
        name="Search"
        component={SearchScreen}
        options={{ animation: 'fade' }}
      />
    </Navigator>
  );
}

export default memo(RootStack);
