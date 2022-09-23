import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import styled from '@emotion/native';

// import SafeAreaContainer from './SafeAreaContainer';

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

function CameraModal() {
  // const [permission, requestPermission] = Camera.useCameraPermissions();
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
          skipProcessing: true,
        });
        const source = data.uri;

        if (data && source) {
          console.log(source);

          setImageSource(source);
        }
      } catch (error) {
        console.log(error);
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

  const onSave = useCallback(() => {
    console.log(imageSource);
  }, [imageSource]);

  if (permission === false || permission === null) {
    return <Text>카메라 접근권한을 허용해주세요.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {imageSource ? (
        <PicturedImage source={{ uri: imageSource }} />
      ) : (
        <Camera
          style={cameraStyle}
          type={type}
          flashMode={flash}
          ref={ref}
          onMountError={(error) => {
            console.log('cammera error', error);
          }}
        />
      )}

      {imageSource ? (
        <ButtonContainer>
          <Text onPress={() => setImageSource(null)}>취소</Text>

          <Text onPress={onSave}>저장</Text>
        </ButtonContainer>
      ) : (
        <ButtonContainer>
          <Text onPress={takePicture}>촬영</Text>

          <Text onPress={toggleCameraType}>뒤집기</Text>

          <Text onPress={onFlash}>플레쉬</Text>
        </ButtonContainer>
      )}
    </View>
  );
}

export default memo(CameraModal);
