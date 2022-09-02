import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { INavigation, ITheme, SystemState } from './types';

const initialState: SystemState = {
  isDark: false,
  from: '',
};

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<ITheme>) {
      state.isDark = action.payload.isDark;
    },
    fromUpdate(state, action: PayloadAction<INavigation>) {
      state.from = action.payload.from;
    },
    fromReset(state) {
      state.from = '';
    },
  },
});

export default systemSlice.reducer;

export const { changeTheme, fromUpdate, fromReset } = systemSlice.actions;
