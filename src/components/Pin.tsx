import React, { memo, useCallback, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import {
  CodeField,
  Cursor,
  RenderCellOptions,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 4;

const styles = StyleSheet.create({
  root: { padding: 20, minHeight: 300 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
});

function Pin() {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  // TODO: 글자가리기
  const renderCell = useCallback(
    ({ index, symbol, isFocused }: RenderCellOptions) => (
      <View
        onLayout={getCellOnLayoutHandler(index)}
        key={index}
        style={[styles.cellRoot, isFocused && styles.focusCell]}
      >
        <Text style={styles.cellText}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      </View>
    ),
    [getCellOnLayoutHandler]
  );

  return (
    <CodeField
      {...props}
      ref={ref}
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      returnKeyType="done"
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={renderCell}
    />
  );
}

export default memo(Pin);
