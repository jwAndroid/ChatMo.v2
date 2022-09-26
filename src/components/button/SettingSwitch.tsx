import React, { memo, useMemo } from 'react';
import { Switch } from 'react-native';
import { useTheme } from '@emotion/react';

interface ISettingSwitch {
  isEnabled: boolean;
  onValueChange: ((value: boolean) => void | Promise<void>) | null | undefined;
}

function SettingSwitch({ isEnabled, onValueChange }: ISettingSwitch) {
  const theme = useTheme();

  const trackColor = useMemo(
    () => ({
      false: theme.color.divider,
      true: theme.color.sky_300,
    }),
    [theme]
  );

  return (
    <Switch
      value={isEnabled}
      onValueChange={onValueChange}
      trackColor={trackColor}
      thumbColor={theme.color.white}
      ios_backgroundColor={theme.color.divider}
    />
  );
}

export default memo(SettingSwitch);
