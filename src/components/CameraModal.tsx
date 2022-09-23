import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Modal, Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import styled from '@emotion/native';
import uuid from 'react-native-uuid';

import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { uploadStorage } from '../firebase/storage';
import SafeAreaContainer from './SafeAreaContainer';
import { getTimestamp } from '../utils/date';
import { RoomEntity } from '../../types';
import { createMessage } from '../firebase/posts';
import { fulfilledChat } from '../redux/chat/slice';

const Container = styled.View(() => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}));

const ButtonContainer = styled.View(() => ({
  height: 70,
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  paddingHorizontal: 20,
}));

const PicturedImage = styled.Image(() => ({
  flex: 1,
}));

interface ICameraModal {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  room: RoomEntity;
}
function CameraModal({ isOpen, setIsOpen, room }: ICameraModal) {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const chat = useAppSelector((state) => state.chat.chat);

  const [permission, setPermission] = useState<boolean>(false);
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [imageSource, setImageSource] = useState<string | null>('');

  const ref = useRef<Camera>(null);

  const cameraStyle = useMemo<StyleProp<ViewStyle>>(
    () => ({
      flex: 1,
    }),
    []
  );

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      setPermission(status === 'granted');
    })();
  }, []);

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
    if (imageSource && user && user.userId && chat.data) {
      const compressed = await manipulateAsync(
        imageSource,
        [{ resize: { width: 800 } }],
        { base64: false, compress: 0.9, format: SaveFormat.JPEG }
      );

      const downloadURL = await uploadStorage(user.userId, compressed.uri);

      if (downloadURL && compressed.uri) {
        const message = {
          _id: uuid.v4().toString(),
          text: '',
          createdAt: getTimestamp(),
          received: false,
          image: downloadURL,
          user: {
            _id: user.userId,
          },
        };

        await createMessage(user.userId, room.roomId, message);

        dispatch(fulfilledChat([message, ...chat.data]));
      }
    }
  }, [dispatch, chat.data, user, imageSource, room.roomId]);

  const onExit = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return permission ? (
    <Modal visible={isOpen} animationType="slide">
      <SafeAreaContainer>
        {imageSource ? (
          <PicturedImage source={{ uri: imageSource }} />
        ) : (
          <Camera
            style={cameraStyle}
            type={type}
            flashMode={flash}
            ref={ref}
            onMountError={(error) => {
              console.log('error!', error);
            }}
          />
        )}

        {imageSource ? (
          <ButtonContainer>
            <Text onPress={onCancel} style={{ color: 'white' }}>
              취소
            </Text>

            <Pressable onPress={onSave} hitSlop={10}>
              <Text style={{ color: 'white' }}>저장</Text>
            </Pressable>
          </ButtonContainer>
        ) : (
          <ButtonContainer>
            <Text onPress={takePicture} style={{ color: 'white' }}>
              촬영
            </Text>

            <Text onPress={toggleCameraType} style={{ color: 'white' }}>
              뒤집기
            </Text>

            <Text onPress={onFlash} style={{ color: 'white' }}>
              플레쉬
            </Text>

            <Text onPress={onExit} style={{ color: 'white' }}>
              취소
            </Text>
          </ButtonContainer>
        )}
      </SafeAreaContainer>
    </Modal>
  ) : (
    <SafeAreaContainer>
      <Container>
        <Text>카메라 접근권한을 허용해주세요.</Text>
      </Container>
    </SafeAreaContainer>
  );
}

export default memo(CameraModal);
