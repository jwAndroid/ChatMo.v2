import React, { memo, useCallback, useState } from 'react';
import { Keyboard, Pressable } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import uuid from 'react-native-uuid';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import { useSelector, useDispatch } from 'react-redux';
import { RootStackNavigationProp, RootStackParamList } from '../RootStack';
import {
  CommonText,
  IconHeader,
  InputModal,
  NotificationModal,
  SafeAreaContainer,
  SettingSwitch,
} from '../../components';
import { ellipsize } from '../../utils/ellipsize';
import { ChipEntity } from '../../../types';
import { onModifyRoom } from '../../firebase/posts';
import { RootState } from '../../redux/rootReducer';
import { getTimestamp } from '../../utils/date';
import { fulfilled } from '../../redux/posts/slice';

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
  paddingVertical: 8,
  marginTop: 10,
  color: theme.color.text,
  borderColor: theme.color.shadow,
}));

const ContentContainer = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 6,
}));

const PasswordInput = styled.TextInput(({ theme }) => ({
  width: 60,
  borderBottomWidth: 1,
  textAlign: 'center',
  borderBottomColor: '#0099ff',
  fontSize: 15,
  color: theme.color.text,
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
  marginLeft: -5,
}));

const Chip = styled.View(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 12,
  borderWidth: 1,
  marginLeft: 5,
  borderColor: theme.color.chip,
}));

const ChipTitleContainer = styled.View(() => ({
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 20,
}));

type ModifyScreenRouteProp = RouteProp<RootStackParamList, 'Modify'>;

function ModifyScreen() {
  const theme = useTheme();

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const { params } = useRoute<ModifyScreenRouteProp>();
  const navigation = useNavigation<RootStackNavigationProp>();

  const [isLock, setIsLock] = useState<boolean>(params?.isLock ?? false);
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [chipValue, setChipValue] = useState('');
  const [chips, setChips] = useState<ChipEntity[] | null>(
    params?.chips ?? null
  );

  console.log(password);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);

  const onBackPress = useCallback(() => {
    navigation.pop();
  }, [navigation]);

  const onPressConfirm = useCallback(() => {
    setIsConfirmModalOpen(true);
  }, []);

  const onPressLayout = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const onPostive = useCallback(() => {
    if (user && params && posts.data) {
      const prepared = {
        ...params,
        title,
        isLock,
        password: isLock ? password : null,
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
    }
  }, [dispatch, user, params, posts, isLock, title, password, chips]);

  const onPostiveInputModal = useCallback(() => {
    if (chips) {
      const create = {
        id: uuid.v4().toString(),
        title: chipValue,
      };

      setChips([...chips, create]);
    }

    setIsInputModalOpen(false);
  }, [chipValue, chips]);

  const onCreateChips = useCallback(() => {
    if (params && chips && chips.length >= 3) {
      setIsOverflow(true);
    } else {
      setChipValue('');

      setIsInputModalOpen(true);

      setIsOverflow(false);
    }
  }, [params, chips]);

  const onPressChipDelete = useCallback(
    (item: ChipEntity) => () => {
      setIsOverflow(false);

      if (chips) {
        setChips(chips.filter((chip) => chip.id !== item.id));
      }
    },
    [chips]
  );

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
            value={title}
            onChangeText={setTitle}
          />

          <CommonText text="패스워드" fontSize={15} marginTop={25} />

          <ContentContainer>
            {isLock ? (
              <PasswordInput
                value={password}
                onChangeText={setPassword}
                maxLength={4}
                placeholder="****"
                clearTextOnFocus
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

            <SettingSwitch isEnabled={isLock} onValueChange={setIsLock} />
          </ContentContainer>

          <ChipTitleContainer>
            <CommonText text="속성" fontSize={15} />

            <CommonText text="1/3" fontSize={12} marginLeft={5} />
          </ChipTitleContainer>

          <ContentContainer>
            <ChipContainer>
              {chips?.map((chip) => (
                <Chip key={chip.id}>
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
            </ChipContainer>

            <PressableCircle onPress={onCreateChips}>
              <Icon
                size={15}
                source={theme.icon.plus}
                tintColor={theme.color.white}
              />
            </PressableCircle>
          </ContentContainer>

          {isOverflow ? (
            <CommonText
              text="3개 이상 만들수 없습니다."
              fontSize={12}
              isSpecificColor
              specificColor={theme.color.shadow}
              marginTop={3}
              marginLeft={3}
            />
          ) : null}
        </ContentsContainer>

        {isConfirmModalOpen && (
          <NotificationModal
            isOpen={isConfirmModalOpen}
            notification="수정 하시겠습니까?"
            onNegative={() => setIsConfirmModalOpen(false)}
            onPostive={onPostive}
          />
        )}

        {isInputModalOpen && (
          <InputModal
            isOpen={isInputModalOpen}
            onNegative={() => setIsInputModalOpen(false)}
            onPostive={onPostiveInputModal}
            value={chipValue}
            onChangeText={setChipValue}
          />
        )}
      </PressableContainer>
    </SafeAreaContainer>
  );
}

export default memo(ModifyScreen);
