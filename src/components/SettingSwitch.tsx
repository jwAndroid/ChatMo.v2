import React, { memo, useMemo } from 'react';
import { Switch } from 'react-native';

interface ISettingSwitch {
  isEnabled: boolean;
  onValueChange: ((value: boolean) => void | Promise<void>) | null | undefined;
}

function SettingSwitch({ isEnabled, onValueChange }: ISettingSwitch) {
  const trackColor = useMemo(
    () => ({
      false: '#767577',
      true: '#767577',
    }),
    []
  );

  return (
    <Switch
      value={isEnabled}
      onValueChange={onValueChange}
      trackColor={trackColor}
      thumbColor={isEnabled ? '#24ddb9' : '#f4f3f4'}
      ios_backgroundColor="#3e3e3e"
    />
  );
}

export default memo(SettingSwitch);
