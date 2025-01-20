import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { flashMessageType,flashMessageValue } from "./types";
// Modal 상태의 인터페이스 정의


// const initialState: UserInfo|null = null;
const initialStateValue: flashMessageType = { flashMessageValue: null };
// 초기 상태 설정
const initialState: flashMessageType = initialStateValue;
;


export const flashMessageSlice = createSlice({
    name: "flashMessage",
    initialState,
    reducers: {
      insertFlashMessage: (state, action: PayloadAction<flashMessageValue>) => {
        const {typeOfFlashMessage,title,subTitle} = action.payload;
        // 상태를 직접 수정하거나 올바른 타입으로 반환
        state.flashMessageValue = {
          typeOfFlashMessage,
          title,
          subTitle,
        };
      },
      clearFlashMessage: (state) => {
        state.flashMessageValue = null; // Immer를 사용하여 null로 설정
      },
    },
  });

// 액션 내보내기
export const { insertFlashMessage,clearFlashMessage } = flashMessageSlice.actions;