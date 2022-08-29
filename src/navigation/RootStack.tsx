import React, { memo } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/core';

import { RoomScreen, RoomsScreen, SettingScreen, ThemeScreen } from './screens';
import { RoomsEntity } from '../../types';

export type RootStackParamList = {
  Rooms: undefined;
  Setting: undefined;
  Room: RoomsEntity | undefined;
  Theme: undefined;
};

export type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Room'>;

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Navigator>
      <Screen
        name="Rooms"
        component={RoomsScreen}
        options={{
          headerShown: false,
        }}
      />

      <Screen
        name="Setting"
        component={SettingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="Room"
        component={RoomScreen}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="Theme"
        component={ThemeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}

export default memo(RootStack);
