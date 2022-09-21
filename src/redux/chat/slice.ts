import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageEntity } from './type';

interface ChatState {
  chat: {
    data: MessageEntity[] | undefined;
  };
}

const initialState: ChatState = {
  chat: {
    data: undefined,
  },
};

const chatSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fulfilledChat(state, action: PayloadAction<MessageEntity[]>) {
      state.chat.data = action.payload;
    },
    reset(state) {
      state.chat.data = [];
    },
  },
});

export default chatSlice.reducer;

export const { fulfilledChat, reset } = chatSlice.actions;
