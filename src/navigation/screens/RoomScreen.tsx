import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Text,
  View,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/core';
import styled from '@emotion/native';
import uuid from 'react-native-uuid';

import { RootState } from '../../redux/rootReducer';
import { fulfilled } from '../../redux/posts/slice';
import { firestore } from '../../firebase/config';
import { RoomScreenRouteProp, RootStackNavigationProp } from '../RootStack';
import { IconHeader, SafeAreaContainer } from '../../components';
import { getFormatTime, getTimestamp } from '../../utils/date';
import usePostsLoadEffect from '../../hooks/usePostsLoadEffect';
import { Post } from '../../redux/posts/type';

const StyledInput = styled.TextInput(() => ({
  width: '100%',
  height: 50,
  backgroundColor: 'skyblue',
}));

function RoomScreen() {
  const dispatch = useDispatch();

  const posts = useSelector((state: RootState) => state.posts.posts);

  const navigation = useNavigation<RootStackNavigationProp>();
  const { params } = useRoute<RoomScreenRouteProp>();

  const [value, setValue] = useState('');

  usePostsLoadEffect();

  const keyExtractor = useCallback((item: Post) => `${item.id}`, []);

  const onSubmitEditing = useCallback(async () => {
    if (posts.data) {
      const currentMessage = {
        id: uuid.v4().toString(),
        text: value,
        renderDay: getFormatTime(),
        createdAt: getTimestamp(),
        type: 'text',
      };

      await addDoc(collection(firestore, 'posts'), currentMessage);

      dispatch(fulfilled([...posts.data, currentMessage]));
    }
  }, [dispatch, value, posts.data]);

  const renderItem = useCallback<ListRenderItem<Post>>(
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
      <IconHeader
        title={params?.title}
        isBackButton
        onPress={() => navigation.pop()}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding' })}
      >
        <FlatList
          data={posts.data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />

        <View>
          <StyledInput
            value={value}
            onChangeText={setValue}
            onSubmitEditing={onSubmitEditing}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
}

export default memo(RoomScreen);
