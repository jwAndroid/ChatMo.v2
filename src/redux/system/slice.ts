import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ThemeState } from './types';

const initialState: ThemeState = {
  isDark: true,
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<ThemeState>) {
      state.isDark = action.payload.isDark;
    },
  },
});

export default systemSlice.reducer;

export const { changeTheme } = systemSlice.actions;
