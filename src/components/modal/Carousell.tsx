import React, { memo, useCallback } from 'react';
import { Modal, Pressable } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import SafeAreaContainer from '../SafeAreaContainer';

const Gallery = styled.Image(() => ({
  flex: 1,
}));

const Header = styled.View(() => ({
  width: '100%',
  height: 60,
  justifyContent: 'center',
  paddingHorizontal: 10,
}));

const Backward = styled.Image(({ theme }) => ({
  width: 20,
  height: 20,
  tintColor: theme.color.icon,
}));

const Footer = styled.View(() => ({
  width: '100%',
  height: 60,
}));

interface ICarousell {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  source: string;
}
function Carousell({ isOpen, setIsOpen, source }: ICarousell) {
  const theme = useTheme();

  const onBackPress = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <SafeAreaContainer>
        <Header>
          <Pressable onPress={onBackPress} hitSlop={10}>
            <Backward source={theme.icon.backward} />
          </Pressable>
        </Header>

        <Gallery source={{ uri: source }} />

        <Footer />
      </SafeAreaContainer>
    </Modal>
  );
}

export default memo(Carousell);
