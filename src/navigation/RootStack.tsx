import React, { memo } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { RoomScreen, RoomsScreen, SettingScreen } from './screens';
import { RoomEntity } from './types';

export type RootStackParamList = {
  Rooms: undefined;
  Setting: undefined;
  Room: RoomEntity | undefined;
};

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
    </Navigator>
  );
}

export default memo(RootStack);
