import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';

import {
  RootStackNavigationProp,
  RootStackParamList,
} from '../navigation/RootStack';

export default function useStack() {
  const navigation = useNavigation<RootStackNavigationProp>();

  const roomParams = useRoute<RouteProp<RootStackParamList, 'Room'>>();
  const pinParams = useRoute<RouteProp<RootStackParamList, 'Pin'>>();

  const routes = navigation.getState()?.routes;
  const prevRouteName = routes[routes.length - 2].name;

  return {
    pinParams,
    roomParams,
    navigation,
    prevRouteName,
  };
}
