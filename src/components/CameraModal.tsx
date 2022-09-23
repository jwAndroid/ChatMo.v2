import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Modal, StyleProp, Text, ViewStyle } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import styled from '@emotion/native';
import SafeAreaContainer from './SafeAreaContainer';

const Container = styled.View(() => ({ flex: 1 }));

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
}
function CameraModal({ isOpen, setIsOpen }: ICameraModal) {
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

  const onSave = useCallback(() => {
    console.log(imageSource);

    // TODO: 1.chat redux dispatch,
    // TODO: 2.firestore db save
    // TODO: 3.storage save
  }, [imageSource]);

  const onExit = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return permission ? (
    <Modal transparent visible={isOpen} animationType="slide">
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

            <Text onPress={onSave} style={{ color: 'white' }}>
              저장
            </Text>
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
    <Container>
      <Text>카메라 접근권한을 허용해주세요.</Text>
    </Container>
  );
}

export default memo(CameraModal);
