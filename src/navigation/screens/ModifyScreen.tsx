import React, { memo, useCallback, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import {
  CommonText,
  IconHeader,
  NotificationModal,
  SafeAreaContainer,
  SettingSwitch,
} from '../../components';
import { ellipsize } from '../../utils/ellipsize';

const PressableContainer = styled.Pressable(() => ({
  flex: 1,
}));

const ContentsContainer = styled.View(() => ({
  flex: 1,
  padding: 20,
}));

const TitleInput = styled.TextInput(({ theme }) => ({
  borderRadius: 8,
  borderWidth: 1,
  fontSize: 17,
  paddingHorizontal: 15,
  paddingVertical: 10,
  marginTop: 10,
  color: theme.color.text,
  borderColor: theme.color.chip,
}));

const ContentContainer = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 10,
}));

const PasswordInput = styled.TextInput(({ theme }) => ({
  width: 55,
  borderBottomWidth: 1,
  textAlign: 'center',
  borderBottomColor: '#0099ff',
  fontSize: 15,
  color: theme.color.text,
}));

const Icon = styled.Image(({ theme }) => ({
  width: 15,
  height: 15,
  tintColor: theme.color.white,
}));

const PressableCircle = styled.Pressable(({ theme }) => ({
  width: 30,
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 15,
  backgroundColor: theme.color.chip,
}));

const ChipContainer = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: -5,
}));

const Chip = styled.View(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 12,
  borderWidth: 1,
  marginLeft: 5,
  borderColor: theme.color.chip,
}));

type ModifyScreenRouteProp = RouteProp<RootStackParamList, 'Modify'>;

function ModifyScreen() {
  const theme = useTheme();

  const { params } = useRoute<ModifyScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();

  const [isEnabled, setIsEnabled] = useState<boolean>(params?.isLock ?? false);
  const [isOpen, setIsOpen] = useState(false);

  const notification = useMemo(() => '수정 하시겠습니까?', []);

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressConfirm = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onPressLayout = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const onPostive = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onNegative = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SafeAreaContainer>
      <PressableContainer onPress={onPressLayout}>
        <IconHeader
          isBackword
          isCheck
          onPress={onBackPress}
          onPressCheck={onPressConfirm}
        />

        <ContentsContainer>
          <CommonText text="제목" fontSize={15} />

          <TitleInput
            placeholder={params?.title}
            placeholderTextColor={theme.color.shadow}
          />

          <CommonText text="패스워드" fontSize={15} marginTop={25} />

          <ContentContainer>
            {isEnabled ? (
              <PasswordInput
                maxLength={4}
                placeholder="****"
                clearTextOnFocus
                onChangeText={(text: string) => {
                  console.log(text);
                }}
                onSubmitEditing={() => {
                  console.log('onSubmitEditing');
                }}
                keyboardType="number-pad"
                returnKeyType="done"
                secureTextEntry
              />
            ) : (
              <CommonText
                text="패스워드가 존재하지 않습니다."
                fontSize={12}
                isSpecificColor
                specificColor={theme.color.shadow}
              />
            )}

            <SettingSwitch isEnabled={isEnabled} onValueChange={setIsEnabled} />
          </ContentContainer>

          <CommonText text="속성" fontSize={15} marginTop={25} />

          <ContentContainer>
            <ChipContainer>
              <Chip>
                <CommonText text={ellipsize('android', 10)} fontSize={12} />
              </Chip>

              <Chip>
                <CommonText text={ellipsize('ios', 10)} fontSize={12} />
              </Chip>

              <Chip>
                <CommonText text={ellipsize('react', 10)} fontSize={12} />
              </Chip>
            </ChipContainer>

            <PressableCircle>
              <Icon source={theme.icon.plus} />
            </PressableCircle>
          </ContentContainer>
        </ContentsContainer>

        {isOpen && (
          <NotificationModal
            isOpen={isOpen}
            notification={notification}
            onNegative={onNegative}
            onPostive={onPostive}
          />
        )}
      </PressableContainer>
    </SafeAreaContainer>
  );
}

export default memo(ModifyScreen);
