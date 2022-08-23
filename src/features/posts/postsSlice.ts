import {
  createSlice,
  nanoid,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
// types
export interface Post {
  id: string;
  title: string;
  body: string;
  date: string;
  reactions: {
    thumbsUp: number;
    wow: number;
    heart: number;
    rocket: number;
    coffee: number;
  };
  userId?: number;
}

export type Reaction = "thumbsUp" | "wow" | "heart" | "rocket" | "coffee";

interface ReactionsPayload {
  postId: string;
  reaction: Reaction;
}

export type Status = "idle" | "loading" | "succeeded" | "failed";

type InitailState = {
  posts: Post[];
  status: Status;
  error: string | null;
};

const initialState: InitailState = {
  posts: [],
  status: "idle", // 'idle' | loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get<Post[]>(POSTS_URL);
  return response.data;
});

type InitailPost = {
  userId: number;
  title: string;
  body: string;
};

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost: InitailPost) => {
    const res = await axios.post<Post>(POSTS_URL, initialPost);
    return res.data;
  }
);

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer: function (state, actions: PayloadAction<Post>) {
        state.posts.unshift(actions.payload);
      },
      prepare: function (userId: number, title: string, body: string) {
        return {
          payload: {
            id: nanoid(),
            userId,
            title,
            body,
            date: new Date().toISOString(),
            reactions: {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            },
          },
        };
      },
    },
    addReaction(state, actions: PayloadAction<ReactionsPayload>) {
      const { postId, reaction } = actions.payload;
      const target = state.posts.find((post) => post.id === postId);
      if (target) {
        target.reactions[reaction]++;
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Adding date and reactions
        let min = 1;
        const loadedPosts = action.payload.map((post: Post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });

        // Add any fetched posts to the array
        state.posts = loadedPosts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // Fix for API post IDs:
        // Creating sortedPosts & assigning the id
        // would be not be needed if the fake API
        // returned accurate new post IDs
        const sortedPosts = state.posts.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        // End fix for fake API post IDs

        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        console.log(action.payload);
        state.posts.push(action.payload);
      });
  },
});

export const { addPost, addReaction } = postsSlice.actions;
export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;
export default postsSlice.reducer;
