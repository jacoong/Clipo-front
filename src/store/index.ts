import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { modalSlice } from "./modalSlice";

const rootReducer = combineReducers({
  modal: modalSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

// RootState 타입 정의
export type RootState = ReturnType<typeof rootReducer>;