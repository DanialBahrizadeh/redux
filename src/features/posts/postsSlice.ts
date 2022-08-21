import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { sub } from "date-fns";

// types
export interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  reactions: {
    thumbsUp: number;
    wow: number;
    heart: number;
    rocket: number;
    coffee: number;
  };
  userId?: string;
}

export type Reaction = "thumbsUp" | "wow" | "heart" | "rocket" | "coffee";

interface ReactionsPayload {
  postId: string;
  reaction: Reaction;
}

const initialState: Post[] = [
  {
    id: "1",
    title: "Learning Redux Toolkit",
    content: "I've heard good things.",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  },
  {
    id: "2",
    title: "Slices...",
    content: "The more I say slice, the more I want pizza.",
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      wow: 0,
      heart: 0,
      rocket: 0,
      coffee: 0,
    },
  },
];

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer: (state, actions: PayloadAction<Post>) => {
        state.unshift(actions.payload);
      },
      prepare: (userId: string, title: string, content: string) => {
        return {
          payload: {
            id: nanoid(),
            userId,
            title,
            content,
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
      const target = state.find((post) => post.id === postId);
      if (target) {
        target.reactions[reaction]++;
      }
    },
  },
});

export const { addPost, addReaction } = postsSlice.actions;
export const selectAllPosts = (state: RootState) => state.posts;
export default postsSlice.reducer;
