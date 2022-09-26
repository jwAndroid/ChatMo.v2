import React, {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
  ListRenderItem,
  StyleProp,
  TouchableHighlight,
  ViewStyle,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import uuid from 'react-native-uuid';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fulfilledChat } from '../../redux/chat/slice';
import { uploadStorage } from '../../firebase/storage';

import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { IconHeader, SafeAreaContainer } from '../../components';
import { compressed } from '../../utils/compress';
import { getFormatTime, getTimestamp } from '../../utils/date';
import { createMessage } from '../../firebase/posts';

const ItemContainer = styled.View({
  margin: 2,
});

interface IItem {
  width: number;
}
const Item = styled.Image<IItem>(({ width }) => ({
  width,
  height: width,
}));

interface ISelection {
  isSelected: boolean;
}
const Selection = styled.View<ISelection>(({ theme, isSelected }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  width: 22,
  height: 22,
  borderWidth: 0.8,
  borderRadius: 11,
  borderColor: theme.color.white,
  backgroundColor: isSelected ? theme.color.chip : undefined,
}));

type GalleryScreenRouteProp = RouteProp<RootStackParamList, 'Gallery'>;

function GalleryScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const chat = useAppSelector((state) => state.chat.chat);

  const theme = useTheme();

  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [selectedItem, setSelectedItem] = useState<string[]>([]);
  const [width, setWidth] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [after, setAfter] = useState('');
  const [pageLoading, setPageLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const navigation = useNavigation<RootStackNavigationProp>();
  const { params } = useRoute<GalleryScreenRouteProp>();

  const contentContainerStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      padding: 2,
      paddingVertical: 15,
    }),
    []
  );

  useLayoutEffect(() => {
    (async () => {
      setPageLoading(true);

      const { assets, hasNextPage, endCursor } =
        await MediaLibrary.getAssetsAsync({
          first: 20,
          mediaType: 'photo',
          sortBy: MediaLibrary.SortBy.creationTime,
        });

      setAssets(assets);
      setHasNext(hasNextPage);
      setAfter(endCursor);
      setPageLoading(false);
    })();
  }, []);

  const keyExtractor = useCallback(
    (item: MediaLibrary.Asset, index: number) => `${index}_${item.id}`,
    []
  );

  const onBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width - 4);
  }, []);

  const onPress = useCallback(
    (item: MediaLibrary.Asset) => () => {
      const findIndex = selectedItem.findIndex(
        (selectedItem) => selectedItem === item.uri
      );

      if (findIndex === -1) {
        setSelectedItem([item.uri]);
      }

      if (findIndex >= 0) {
        setSelectedItem((selectedItem) =>
          selectedItem.filter((selectedItem) => selectedItem !== item.uri)
        );
      }
    },
    [selectedItem]
  );

  const renderItem = useCallback<ListRenderItem<MediaLibrary.Asset>>(
    ({ item }) => {
      const findIndex = selectedItem.findIndex(
        (selectedItem) => selectedItem === item.uri
      );

      const isSelected = findIndex >= 0;

      return (
        <TouchableHighlight underlayColor="transparent" onPress={onPress(item)}>
          <ItemContainer>
            <Item width={width / 3 - 4} source={{ uri: item.uri }} />

            <Selection isSelected={isSelected} />
          </ItemContainer>
        </TouchableHighlight>
      );
    },
    [selectedItem, onPress, width]
  );

  const onEndReached = useCallback(async () => {
    if (hasNext) {
      setPageLoading(true);

      const { assets, hasNextPage, endCursor } =
        await MediaLibrary.getAssetsAsync({
          first: 20,
          mediaType: 'photo',
          sortBy: MediaLibrary.SortBy.creationTime,
          after: `${after}`,
        });

      setAssets((prev) => [...prev, ...assets]);
      setHasNext(hasNextPage);
      setAfter(endCursor);
      setPageLoading(false);
    }
  }, [hasNext, after]);

  const onPressConfirm = useCallback(async () => {
    if (
      selectedItem.length > 0 &&
      selectedItem[0] &&
      user &&
      user.userId &&
      chat.data &&
      params
    ) {
      setUploadLoading(true);

      const compressedURL = await compressed(selectedItem[0]);

      const downloadURL = await uploadStorage(user.userId, compressedURL);

      if (downloadURL && compressedURL) {
        const message = {
          _id: uuid.v4().toString(),
          text: `${getFormatTime(getTimestamp(), true)}_image`,
          createdAt: getTimestamp(),
          received: false,
          image: downloadURL,
          user: {
            _id: user.userId,
          },
        };

        await createMessage(user.userId, params.roomId, message);

        dispatch(fulfilledChat([message, ...chat.data]));

        setUploadLoading(false);

        navigation.pop();
      }
    }
  }, [dispatch, chat.data, user, selectedItem, params, navigation]);

  return (
    <SafeAreaContainer>
      <IconHeader
        isBackword
        onPress={onBackPress}
        isCheck
        onPressCheck={onPressConfirm}
      />

      <FlatList
        data={assets}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={3}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentContainerStyle}
        onEndReached={onEndReached}
        onLayout={onLayout}
      />

      {pageLoading ? (
        <ActivityIndicator size="small" color={theme.color.chip} />
      ) : null}

      {uploadLoading ? (
        <ActivityIndicator size="small" color={theme.color.chip} />
      ) : null}
    </SafeAreaContainer>
  );
}

export default memo(GalleryScreen);
