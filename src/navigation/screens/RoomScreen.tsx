import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import styled from '@emotion/native';
import uuid from 'react-native-uuid';

import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { RootState } from '../../redux/rootReducer';
import { IconHeader, SafeAreaContainer } from '../../components';
import { getFormatTime, getTimestamp } from '../../utils/date';
import { firestore } from '../../firebase/config';
import { chatSampleData } from '../../../sampleData';
import { fulfilled } from '../../redux/posts/slice';

const Container = styled.Pressable(() => ({
  flex: 1,
}));

const StyledInput = styled.TextInput(() => ({
  width: '100%',
  height: 50,
  backgroundColor: 'skyblue',
}));

interface Message {
  id: string;
  text: string;
  renderDay: string | null;
  createdAt: number;
  type: string;
}

type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Room'>;

function RoomScreen() {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);

  console.log(JSON.stringify(posts, null, 5));

  const navigation = useNavigation<RootStackNavigationProp>();
  const { params } = useRoute<RoomScreenRouteProp>();

  const [value, setValue] = useState('');
  const [prepare, setPrepare] = useState<Message[]>(chatSampleData);

  const [renderData, setRenderData] = useState<Message[]>([]);

  const onPressDispath = useCallback(() => {
    dispatch(
      fulfilled([
        ...chatSampleData,
        {
          id: '123',
          text: '추가',
          renderDay: '렌더데이',
          createdAt: 123,
          type: '텍스트추가',
        },
      ])
    );
  }, [dispatch]);

  const onChangeText = useCallback((text: string) => {
    setValue(text);
  }, []);

  const onSubmitEditing = useCallback(async () => {
    if (user && params !== undefined && params !== null) {
      const ref = collection(firestore, 'posts');

      const currentMessage = {
        id: uuid.v4().toString(),
        text: value,
        renderDay: getFormatTime(),
        createdAt: getTimestamp(),
        type: 'text',
      };

      setPrepare((prev) => prev.concat(currentMessage));

      if (prepare[prepare.length - 1].renderDay === currentMessage.renderDay) {
        setRenderData([...renderData, { ...currentMessage, renderDay: null }]);

        await addDoc(ref, {
          ...currentMessage,
          renderDay: null,
        });
      } else {
        setRenderData([
          ...renderData,
          { ...currentMessage, renderDay: getFormatTime() },
        ]);

        await addDoc(ref, {
          ...currentMessage,
          renderDay: getFormatTime(),
        });
      }
    }
  }, [value, prepare, renderData, user, params]);

  const keyExtractor = useCallback((item: Message) => `${item.id}`, []);

  const renderItem = useCallback<ListRenderItem<Message>>(
    ({ item }) => (
      <View>
        {item.renderDay && <Text>{item.renderDay}</Text>}

        <Text>{item.text}</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaContainer>
      <IconHeader isBackButton onPress={() => navigation.pop()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding' })}
      >
        <Container onPress={() => Keyboard.dismiss()}>
          <FlatList
            data={renderData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
          />
        </Container>

        <View>
          <StyledInput
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
          />

          <Pressable
            onPress={onPressDispath}
            style={{ width: 50, height: 50, backgroundColor: 'red' }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
}

export default memo(RoomScreen);
