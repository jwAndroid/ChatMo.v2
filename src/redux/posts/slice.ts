import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoomEntity } from './type';

interface PostsState {
  posts: {
    data: RoomEntity[] | null;
  };
}

const initialState: PostsState = {
  posts: {
    data: null,
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fulfilled(state, action: PayloadAction<RoomEntity[]>) {
      state.posts.data = action.payload;
    },
  },
});

export default postsSlice.reducer;

export const { fulfilled } = postsSlice.actions;
