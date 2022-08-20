import { configureStore } from "@reduxjs/toolkit";
import coutnerReducer from "../features/counter/counterSlice";
export const store = configureStore({
  reducer: {
    counter: coutnerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
