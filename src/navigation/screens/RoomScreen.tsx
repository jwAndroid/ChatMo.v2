import React, { memo, useCallback, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/core';
import styled from '@emotion/native';

import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Text,
  View,
} from 'react-native';
import { RootStackNavigationProp } from '../RootStack';
// import { RootState } from '../../redux/rootReducer';
import { IconHeader, SafeAreaContainer } from '../../components';
import { getFormatTime, getTimestamp } from '../../utils/date';
import { chatSampleData } from '../../../sampleData';

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

// type RoomScreenRouteProp = RouteProp<RootStackParamList, 'Room'>;

function RoomScreen() {
  // const user = useSelector((state: RootState) => state.auth.user);

  const navigation = useNavigation<RootStackNavigationProp>();

  // const { params } = useRoute<RoomScreenRouteProp>();

  const [value, setValue] = useState('');
  const [prepare, setPrepare] = useState<Message[]>(chatSampleData);

  const [renderData, setRenderData] = useState<Message[]>([]);

  useEffect(() => {
    console.log(JSON.stringify(renderData, null, 5));
  }, [renderData]);

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onChangeText = useCallback((text: string) => {
    setValue(text);
  }, []);

  const onSubmitEditing = useCallback(() => {
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
    } else {
      setRenderData([
        ...renderData,
        { ...currentMessage, renderDay: getFormatTime() },
      ]);
    }
  }, [value, prepare, renderData]);

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
      <IconHeader isBackButton onPress={onBackPress} />

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

        <StyledInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
        />
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
}

export default memo(RoomScreen);
