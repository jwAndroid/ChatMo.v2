import React, { memo, useCallback, useState } from 'react';
import { Keyboard, Pressable } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import uuid from 'react-native-uuid';

import {
  Chip,
  CommonText,
  IconHeader,
  InputModal,
  NotificationModal,
  SafeAreaContainer,
  SettingSwitch,
} from '../../components';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { fulfilled } from '../../redux/posts/slice';
import { onModifyRoom } from '../../firebase/posts';
import { ellipsize } from '../../utils/ellipsize';
import { getTimestamp } from '../../utils/date';
import { ChipEntity } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';

const PressableContainer = styled.Pressable(() => ({
  flex: 1,
}));

const ContentsContainer = styled.View(() => ({
  flex: 1,
  paddingHorizontal: 20,
  paddingVertical: 10,
}));

const TitleInput = styled.TextInput(({ theme }) => ({
  borderRadius: 8,
  borderWidth: 1,
  fontSize: 15,
  paddingHorizontal: 15,
  paddingVertical: 8,
  marginTop: 10,
  color: theme.color.text,
  borderColor: theme.color.shadow,
}));

interface IContentContainer {
  marginTop?: number;
}
const ContentContainer = styled.View<IContentContainer>(
  ({ marginTop = 0 }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop,
  })
);

const PasswordInput = styled.TextInput(({ theme }) => ({
  width: 60,
  borderBottomWidth: 1,
  textAlign: 'center',
  fontSize: 15,
  color: theme.color.text,
  padding: 3,
  borderBottomColor: '#0099ff',
}));

interface IIcon {
  size: number;
  tintColor: string;
  marginLeft?: number;
}
const Icon = styled.Image<IIcon>(({ size, tintColor, marginLeft }) => ({
  width: size,
  height: size,
  tintColor,
  marginLeft,
}));

const PressableCircle = styled.TouchableOpacity(({ theme }) => ({
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
  marginLeft: -8,
}));

const ChipTitleContainer = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
}));

const Block = styled.View(() => ({
  height: 40,
  justifyContent: 'center',
  marginVertical: 10,
}));

type ModifyScreenRouteProp = RouteProp<RootStackParamList, 'Modify'>;

function ModifyScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);

  const theme = useTheme();

  const { params } = useRoute<ModifyScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();

  const [isLock, setIsLock] = useState<boolean>(params?.isLock ?? false);
  const [title, setTitle] = useState(params?.title ?? '');
  const [passwordValue, setPasswordValue] = useState(params?.password ?? '');
  const [chipValue, setChipValue] = useState('');
  const [chips, setChips] = useState<ChipEntity[] | null>(
    params?.chips ?? null
  );

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [error, setError] = useState(false);

  const onPostive = useCallback(() => {
    if (user && params && posts.data) {
      if ((isLock && passwordValue.length < 4) || title === '') {
        setError(true);
      } else {
        const prepared = {
          ...params,
          title,
          isLock,
          password: isLock ? passwordValue : null,
          modifyAt: getTimestamp(),
          chips,
        };

        const updatedRooms = posts.data.map((post) =>
          post.roomId === params.roomId
            ? {
                ...post,
                ...prepared,
              }
            : post
        );

        dispatch(fulfilled(updatedRooms));

        onModifyRoom(user.userId, { ...prepared });

        setIsConfirmModalOpen(false);

        setError(false);

        navigation.popToTop();
      }
    }
  }, [
    dispatch,
    user,
    params,
    posts,
    isLock,
    title,
    passwordValue,
    chips,
    navigation,
  ]);

  const onNegative = useCallback(() => {
    setIsConfirmModalOpen(false);

    setError(false);
  }, []);

  const onPostiveChipInputModal = useCallback(() => {
    if (chips && chipValue.length > 0) {
      const chip = {
        id: uuid.v4().toString(),
        title: chipValue,
      };

      setChips([...chips, chip]);

      setIsInputModalOpen(false);
    } else {
      setIsInputModalOpen(false);
    }
  }, [chipValue, chips]);

  const onCreateChips = useCallback(() => {
    setChipValue('');

    setIsInputModalOpen(true);
  }, []);

  const onPressChipDelete = useCallback(
    (item: ChipEntity) => () => {
      if (chips) {
        setChips(chips.filter((chip) => chip.id !== item.id));
      }
    },
    [chips]
  );

  return (
    <SafeAreaContainer>
      <PressableContainer onPress={() => Keyboard.dismiss()}>
        <IconHeader
          isBackword
          isCheck
          onPress={() => navigation.popToTop()}
          onPressCheck={() => setIsConfirmModalOpen(true)}
        />

        <ContentsContainer>
          <CommonText text="제목" fontSize={15} />

          <TitleInput
            placeholder="제목을 입력해주세요."
            placeholderTextColor={theme.color.shadow}
            value={title}
            onChangeText={setTitle}
            blurOnSubmit
          />

          <CommonText text="패스워드" fontSize={15} marginTop={20} />

          <ContentContainer>
            {isLock ? (
              <Block>
                <PasswordInput
                  value={passwordValue}
                  onChangeText={setPasswordValue}
                  maxLength={4}
                  placeholder="* * * *"
                  placeholderTextColor={theme.color.shadow}
                  keyboardType="number-pad"
                  clearTextOnFocus
                  returnKeyType="done"
                  secureTextEntry
                />

                <CommonText
                  text="비밀번호는 찾을수 없으니, 신중하게 결정 해주세요."
                  fontSize={12}
                  isSpecificColor
                  specificColor={theme.color.shadow}
                  marginTop={5}
                />
              </Block>
            ) : (
              <Block>
                <CommonText
                  text="패스워드가 존재하지 않습니다."
                  fontSize={13}
                  isSpecificColor
                  specificColor={theme.color.shadow}
                />
              </Block>
            )}

            <SettingSwitch isEnabled={isLock} onValueChange={setIsLock} />
          </ContentContainer>

          <ChipTitleContainer>
            <CommonText text="속성" fontSize={15} />

            <CommonText
              text={`${chips?.length}/3`}
              fontSize={12}
              marginLeft={5}
            />
          </ChipTitleContainer>

          <ContentContainer marginTop={10}>
            <ChipContainer>
              {chips?.map((chip) => (
                <Chip isRow key={chip.id}>
                  <CommonText text={ellipsize(chip.title, 10)} fontSize={13} />

                  <Pressable hitSlop={10} onPress={onPressChipDelete(chip)}>
                    <Icon
                      size={17}
                      tintColor={theme.color.icon}
                      source={theme.icon.cancel}
                      marginLeft={3}
                    />
                  </Pressable>
                </Chip>
              ))}

              {chips?.length === 0 ? (
                <CommonText
                  text="속성이 없습니다."
                  fontSize={12}
                  marginLeft={5}
                  isSpecificColor
                  specificColor={theme.color.shadow}
                />
              ) : null}
            </ChipContainer>

            <PressableCircle onPress={onCreateChips}>
              <Icon
                size={15}
                source={theme.icon.plus}
                tintColor={theme.color.white}
              />
            </PressableCircle>
          </ContentContainer>

          {chips!.length >= 3 ? (
            <CommonText
              text="3개 이상 만들수 없습니다."
              fontSize={12}
              isSpecificColor
              specificColor={theme.color.shadow}
              marginTop={5}
            />
          ) : null}
        </ContentsContainer>
      </PressableContainer>

      {isConfirmModalOpen && (
        <NotificationModal
          isOpen={isConfirmModalOpen}
          notification="수정 하시겠습니까?"
          onNegative={onNegative}
          onPostive={onPostive}
          error={error}
        />
      )}

      {isInputModalOpen && (
        <InputModal
          isOpen={isInputModalOpen}
          onNegative={() => setIsInputModalOpen(false)}
          onPostive={onPostiveChipInputModal}
          value={chipValue}
          onChangeText={setChipValue}
        />
      )}
    </SafeAreaContainer>
  );
}

export default memo(ModifyScreen);
