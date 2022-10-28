import React, { memo } from 'react';
import { Modal, View } from 'react-native';

// TODO: PinScreen to PinModal Refector

function PinModal() {
  return (
    <Modal transparent visible={false} animationType="slide">
      <View />
    </Modal>
  );
}

export default memo(PinModal);
