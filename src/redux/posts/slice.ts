import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from './type';

interface PostsState {
  posts: {
    data: Post[] | null;
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
    fulfilled(state, action: PayloadAction<Post[]>) {
      state.posts.data = action.payload;
    },
  },
});

export default postsSlice.reducer;

export const { fulfilled } = postsSlice.actions;
