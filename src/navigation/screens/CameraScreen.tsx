import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import uuid from 'react-native-uuid';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fulfilledChat } from '../../redux/chat/slice';
import { uploadStorage } from '../../firebase/storage';
import { createMessage } from '../../firebase/posts';
import { compressed } from '../../utils/compress';
import { getFormatTime, getTimestamp } from '../../utils/date';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { Icon } from '../../components';

const SafeContainer = styled.SafeAreaView(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.color.black,
}));

const Container = styled.View(() => ({
  flex: 1,
}));

const Header = styled.View(({ theme }) => ({
  height: 100,
  paddingHorizontal: 20,
  paddingTop: 20,
  justifyContent: 'center',
  backgroundColor: theme.color.black,
}));

const ButtonContainer = styled.View(({ theme }) => ({
  height: 150,
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  paddingHorizontal: 30,
  backgroundColor: theme.color.black,
}));

interface IShootingButton {
  marginLeft?: number;
}
const ShootingButton = styled.TouchableOpacity<IShootingButton>(
  ({ theme, marginLeft = 0 }) => ({
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft,
    backgroundColor: theme.color.white,
  })
);

const IinnerLine = styled.View(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: 30,
  borderWidth: 1.5,
  justifyContent: 'center',
  alignItems: 'center',
  borderColor: theme.color.gray,
  backgroundColor: theme.color.white,
}));

interface IFlashIcon {
  isFlash: boolean;
}
const FlashIcon = styled.Image<IFlashIcon>(({ theme, isFlash }) => ({
  width: 22,
  height: 22,
  tintColor: isFlash ? theme.color.yellow : theme.color.white,
}));

const StyledText = styled.Text(({ theme }) => ({
  fontSize: 17,
  fontWeight: '600',
  color: theme.color.white,
}));

const PicturedImage = styled.Image(() => ({
  flex: 1,
}));

type CameraScreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

function CameraScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const chat = useAppSelector((state) => state.chat.chat);

  const theme = useTheme();

  const navigation = useNavigation<RootStackNavigationProp>();
  const { params } = useRoute<CameraScreenRouteProp>();

  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [imageSource, setImageSource] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef<Camera>(null);

  const cameraStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      flex: 1,
    }),
    []
  );

  const takePicture = useCallback(async () => {
    if (ref.current) {
      try {
        const data = await ref.current.takePictureAsync({
          quality: 0.5,
          base64: true,
          exif: false,
          skipProcessing: true,
        });

        if (data) {
          setImageSource(data.uri);
        }
      } catch (message) {
        console.log(message);
      }
    }
  }, []);

  const onFlash = useCallback(() => {
    setFlash((prev) => (prev === FlashMode.off ? FlashMode.on : FlashMode.off));
  }, []);

  const toggleCameraType = useCallback(() => {
    setType((prev) =>
      prev === CameraType.back ? CameraType.front : CameraType.back
    );
  }, []);

  const onCancel = useCallback(() => {
    if (imageSource) {
      setImageSource(null);
    }
  }, [imageSource]);

  const onSave = useCallback(async () => {
    setIsLoading(true);

    if (imageSource && user && user.userId && chat.data && params) {
      const compressedURL = await compressed(imageSource);

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

        setIsLoading(false);

        navigation.pop();
      }
    }
  }, [dispatch, chat.data, user, imageSource, params, navigation]);

  const onExit = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  return (
    <SafeContainer>
      {imageSource ? (
        <Container>
          <Header>
            {isLoading ? (
              <ActivityIndicator size="large" color={theme.color.chip} />
            ) : null}
          </Header>

          <PicturedImage source={{ uri: imageSource }} />

          <ButtonContainer>
            <Pressable onPress={onCancel} hitSlop={10} disabled={!!isLoading}>
              <StyledText>취소</StyledText>
            </Pressable>

            <Pressable onPress={onSave} hitSlop={10} disabled={!!isLoading}>
              <StyledText>사진 사용</StyledText>
            </Pressable>
          </ButtonContainer>
        </Container>
      ) : (
        <Container>
          <Header>
            <Pressable onPress={onFlash}>
              <FlashIcon
                source={
                  flash === FlashMode.on
                    ? theme.icon.flash_on
                    : theme.icon.flash_off
                }
                isFlash={flash === FlashMode.on}
              />
            </Pressable>
          </Header>

          <Camera ref={ref} type={type} flashMode={flash} style={cameraStyle} />

          <ButtonContainer>
            <Icon
              source={theme.icon.cancel}
              size={30}
              tintColor={theme.color.white}
              onPress={onExit}
            />

            <ShootingButton>
              <IinnerLine>
                <Icon
                  source={theme.icon.photo_camera}
                  size={30}
                  tintColor={theme.color.gray}
                  onPress={takePicture}
                />
              </IinnerLine>
            </ShootingButton>

            <Icon
              source={theme.icon.flip_camera}
              size={30}
              tintColor={theme.color.white}
              onPress={toggleCameraType}
            />
          </ButtonContainer>
        </Container>
      )}
    </SafeContainer>
  );
}

export default memo(CameraScreen);
