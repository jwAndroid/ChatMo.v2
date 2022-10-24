import React, { memo, useMemo } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import {
  CameraScreen,
  FormScreen,
  GalleryScreen,
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
  Form: RoomEntity | undefined;
  Search: undefined;
  Camera: RoomEntity;
  Gallery: RoomEntity;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  const screenOptions = useMemo<NativeStackNavigationOptions>(
    () => ({
      headerShown: false,
      gestureEnabled: true,
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
        options={{ animation: 'slide_from_right' }}
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
        name="Form"
        component={FormScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Screen
        name="Search"
        component={SearchScreen}
        options={{ animation: 'fade' }}
      />
      <Screen
        name="Camera"
        component={CameraScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Screen
        name="Gallery"
        component={GalleryScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Navigator>
  );
}

export default memo(RootStack);
