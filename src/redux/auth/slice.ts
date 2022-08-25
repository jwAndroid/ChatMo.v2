import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserEntity } from './type';

interface AuthState {
  user: UserEntity | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authorize(state, action: PayloadAction<UserEntity>) {
      state.user = action.payload;
    },
  },
});

export default authSlice.reducer;

export const { authorize } = authSlice.actions;
