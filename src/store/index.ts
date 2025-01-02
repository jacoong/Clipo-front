import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { modalSlice } from "./modalSlice";
import { userInfoSlice } from "./loginUserInfoSlice";
import { infoNavSlice } from "./infoOfNavSlice";

const rootReducer = combineReducers({
  modal: modalSlice.reducer,
  loginUserInfo: userInfoSlice.reducer,
  infoNavSlice: infoNavSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

// RootState 타입 정의
export type RootState = ReturnType<typeof rootReducer>;