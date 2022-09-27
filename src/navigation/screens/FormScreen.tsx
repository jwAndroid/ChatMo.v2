import React, { memo, useCallback, useState } from 'react';
import { Keyboard, Pressable } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import uuid from 'react-native-uuid';

import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fulfilled } from '../../redux/posts/slice';
import { createRoom, onModifyRoom } from '../../firebase/posts';
import useBackEffect from '../../hooks/useBackEffect';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import { ChipEntity } from '../../../types';
import { getTimestamp } from '../../utils/date';
import { ellipsize } from '../../utils/text';
import { StyledText, Icon, IconHeader } from '../../components';
import { NotificationModal, InputModal } from '../../components/modal';
import { ButtonBar, SettingSwitch } from '../../components/button';
import { PasswordInput, TitleInput } from '../../components/input';
import { KeyboardContainer, SafeAreaContainer } from '../../components/layout';
import { Chip } from '../../components/item';

const Container = styled.View(() => ({
  flex: 1,
  paddingHorizontal: 20,
  paddingVertical: 10,
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

const ChipContainer = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: -5,
}));

const ChipTitleContainer = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
}));

const Block = styled.View(() => ({
  justifyContent: 'center',
  marginVertical: 10,
}));

type FormScreenRouteProp = RouteProp<RootStackParamList, 'Form'>;

function FormScreen() {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const posts = useAppSelector((state) => state.posts.posts);

  const theme = useTheme();

  const { params } = useRoute<FormScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();

  const [titleValue, setTitleValue] = useState(params?.title ?? '');
  const [passwordValue, setPasswordValue] = useState(params?.password ?? '');
  const [chipValue, setChipValue] = useState('');

  const [isLock, setIsLock] = useState<boolean>(params?.isLock ?? false);
  const [chips, setChips] = useState<ChipEntity[] | null>(params?.chips ?? []);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [error, setError] = useState(false);

  useBackEffect();

  const onPostive = useCallback(() => {
    if (user && posts.data) {
      if ((isLock && passwordValue.length < 4) || titleValue === '') {
        setError(true);
      } else if (params) {
        const prepared = {
          ...params,
          title: titleValue,
          isLock,
          password: isLock ? passwordValue : null,
          modifyAt: getTimestamp(),
          chips: chips === undefined || null ? [] : chips,
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

        onModifyRoom(user.userId, params.roomId, { ...prepared });

        setIsConfirmModalOpen(false);

        setError(false);

        navigation.popToTop();
      } else if (params === undefined) {
        const room = {
          roomId: uuid.v4().toString(),
          title: titleValue,
          lastMemo: null,
          memoCount: 1,
          isFavorites: false,
          isCompleate: false,
          isLock,
          password: isLock ? passwordValue : null,
          createdAt: getTimestamp(),
          updatedAt: getTimestamp(),
          modifyAt: null,
          chips: chips === undefined || null ? [] : chips,
        };

        createRoom(user.userId, room);

        dispatch(fulfilled([room, ...posts.data]));

        setIsConfirmModalOpen(false);

        setError(false);

        navigation.popToTop();
      }
    }
  }, [
    user,
    params,
    posts,
    dispatch,
    isLock,
    titleValue,
    passwordValue,
    chips,
    navigation,
  ]);

  const onNegative = useCallback(() => {
    setIsConfirmModalOpen(false);

    setError(false);
  }, []);

  const onPostiveChipInputModal = useCallback(() => {
    const chip = {
      id: uuid.v4().toString(),
      title: chipValue,
    };

    if (chips && chipValue.length > 0) {
      setChips([...chips, chip]);
    } else if (
      chips === undefined ||
      (chips === null && chipValue.length > 0)
    ) {
      setChips([chip]);
    }

    setIsInputModalOpen(false);
  }, [chipValue, chips]);

  const onCreateChips = useCallback(() => {
    if (chips && chips.length >= 3) {
      setIsInputModalOpen(false);
    } else {
      setIsInputModalOpen(true);
    }

    setChipValue('');
  }, [chips]);

  const onPressChipDelete = useCallback(
    (item: ChipEntity) => () => {
      if (chips) {
        setChips(chips.filter((chip) => chip.id !== item.id));
      }
    },
    [chips]
  );

  const onBackPress = useCallback(() => {
    navigation.popToTop();
  }, [navigation]);

  return (
    <SafeAreaContainer>
      <KeyboardContainer>
        <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
          <IconHeader isBackword onPress={onBackPress} />

          <Container>
            <StyledText text="제목" fontSize={15} />

            <TitleInput value={titleValue} onChangeText={setTitleValue} />

            <StyledText text="패스워드" fontSize={15} marginTop={20} />

            <ContentContainer>
              {isLock ? (
                <Block>
                  <PasswordInput
                    value={passwordValue}
                    onChangeText={setPasswordValue}
                  />

                  <StyledText
                    text="비밀번호는 찾을수 없으니, 신중하게 결정 해주세요."
                    fontSize={12}
                    specificColor={theme.color.shadow}
                    marginTop={5}
                  />
                </Block>
              ) : (
                <StyledText
                  text="패스워드가 존재하지 않습니다."
                  fontSize={13}
                  specificColor={theme.color.shadow}
                />
              )}

              <SettingSwitch isEnabled={isLock} onValueChange={setIsLock} />
            </ContentContainer>

            <ChipTitleContainer>
              <StyledText text="속성" fontSize={15} />

              {chips && (
                <StyledText
                  text={`${chips.length}/3`}
                  fontSize={12}
                  marginLeft={5}
                  specificColor={
                    chips.length >= 3 ? theme.color.red : theme.color.text
                  }
                />
              )}
            </ChipTitleContainer>

            <ContentContainer marginTop={10}>
              <ChipContainer>
                {chips &&
                  chips.map((chip) => (
                    <Chip isRow key={chip.id}>
                      <StyledText
                        text={ellipsize(chip.title, 10)}
                        fontSize={13}
                      />

                      <Icon
                        onPress={onPressChipDelete(chip)}
                        size={17}
                        tintColor={theme.color.icon}
                        source={theme.icon.cancel}
                        marginLeft={3}
                      />
                    </Chip>
                  ))}

                {chips === undefined ||
                  (chips && chips.length === 0 && (
                    <StyledText
                      text="속성이 없습니다."
                      fontSize={12}
                      marginLeft={5}
                      specificColor={theme.color.shadow}
                    />
                  ))}
              </ChipContainer>

              <Icon
                isCircle
                onPress={onCreateChips}
                size={15}
                source={theme.icon.add}
                tintColor={theme.color.white}
              />
            </ContentContainer>
          </Container>
        </Pressable>

        <ButtonBar
          onCancel={onBackPress}
          onConfirm={() => setIsConfirmModalOpen(true)}
        />

        {isConfirmModalOpen && (
          <NotificationModal
            isOpen={isConfirmModalOpen}
            notification={
              params === undefined ? '생성 하시겠습니까?' : '수정 하시겠습니가?'
            }
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
      </KeyboardContainer>
    </SafeAreaContainer>
  );
}

export default memo(FormScreen);
