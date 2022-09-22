import React, { memo, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

interface IKeyboardContainer {
  children: ReactNode;
}

function KeyboardContainer({ children }: IKeyboardContainer) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: 'padding' })}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

export default memo(KeyboardContainer);
