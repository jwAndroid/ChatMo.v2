import React, { memo, useCallback, useState } from 'react';
import styled from '@emotion/native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import { IconHeader, SafeAreaContainer } from '../../components';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.color.background,
}));

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Pin'>;

function RoomScreen() {
  const { bottom } = useSafeAreaInsets();

  const navigation = useNavigation<RootStackNavigationProp>();

  const { params } = useRoute<RoomScreenRouteProp>();

  console.log(JSON.stringify(params, null, 5));

  const [messages, setMessages] = useState<IMessage[]>([
    {
      _id: 1,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'React Native',
      },
    },
  ]);

  // useEffect(() => {
  //   navigation.addListener('beforeRemove', () => {
  //     if (prevRouteName === 'Pin') {
  //       navigation.popToTop();
  //     } else if (prevRouteName === 'Search') {
  //       navigation.goBack();
  //     } else {
  //       navigation.goBack();
  //     }
  //   });
  // }, [navigation, prevRouteName]);

  const onBackPress = useCallback(() => {
    const routes = navigation.getState()?.routes;
    const prevRouteName = routes[routes.length - 2].name;

    if (prevRouteName === 'Pin') {
      navigation.popToTop();
    } else if (prevRouteName === 'Search') {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
  }, [navigation]);

  const onSend = useCallback((messages: IMessage[]) => {
    setMessages((prev) => GiftedChat.append(prev, messages));
  }, []);

  return (
    <Container>
      <IconHeader isBackword isIosTopInset onPress={onBackPress} />

      <SafeAreaContainer>
        <GiftedChat
          messages={messages}
          wrapInSafeArea={false}
          alignTop
          alwaysShowSend
          showUserAvatar={false}
          bottomOffset={bottom === 0 ? 0 : bottom}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1,
          }}
        />
      </SafeAreaContainer>
    </Container>
  );
}

export default memo(RoomScreen);
