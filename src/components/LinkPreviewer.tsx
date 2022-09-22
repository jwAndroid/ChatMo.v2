import React, { memo, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { getLinkPreview } from 'link-preview-js';

import { PreviewEntity } from '../../types';
import { ellipsize, regexUrl } from '../utils/text';
import CommonText from './CommonText';
import ToastModal from './ToastModal';

const TextContainer = styled.View(() => ({
  alignItems: 'flex-end',
}));

const ImageHolder = styled.Image(() => ({
  height: 150,
  borderRadius: 10,
  marginTop: 10,
  resizeMode: 'cover',
}));

interface ILinkPreviewer {
  url: string;
}
function LinkPreviewer({ url }: ILinkPreviewer) {
  const theme = useTheme();

  const [data, setData] = useState<PreviewEntity>();
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (regexUrl(url) && url) {
        try {
          const response = await getLinkPreview(url);

          if (!response) {
            return;
          }

          setData(response as PreviewEntity);

          setLoading(false);
        } catch (error) {
          console.log('error');
        }
      }
    })();
  }, [url]);

  const onPress = useCallback(
    (data: PreviewEntity) => async () => {
      await Linking.openURL(data.url);
    },
    []
  );

  const onLongPress = useCallback(
    (data: PreviewEntity) => async () => {
      if (data.url) {
        await Clipboard.setStringAsync(data.url);

        setShowToast(true);
      }
    },
    []
  );

  return loading ? (
    <ActivityIndicator size="small" color={theme.color.card} />
  ) : (
    <View>
      <TextContainer>
        {data && data.title ? (
          <CommonText
            text={data.title}
            fontSize={15}
            isSpecificColor
            specificColor={theme.color.white}
          />
        ) : null}

        {data && data.description ? (
          <CommonText
            text={ellipsize(data.description, 30)}
            fontSize={12}
            isSpecificColor
            specificColor={theme.color.shadow}
            marginTop={5}
          />
        ) : null}

        {data && data.url ? (
          <CommonText
            text={ellipsize(data.url, 30)}
            fontSize={12}
            isSpecificColor
            specificColor={theme.color.shadow}
            marginTop={5}
          />
        ) : null}
      </TextContainer>

      {data && data.images.length > 0 ? (
        <Pressable
          onPress={data && onPress(data)}
          onLongPress={data && onLongPress(data)}
        >
          <ImageHolder source={{ uri: data.images[0] }} />
        </Pressable>
      ) : null}

      {showToast ? (
        <ToastModal
          text="클립보드에 주소가 복사 되었습니다."
          showToast={showToast}
          setShowToast={setShowToast}
        />
      ) : null}
    </View>
  );
}

export default memo(LinkPreviewer);