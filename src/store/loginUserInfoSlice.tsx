import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "./types";
// Modal 상태의 인터페이스 정의


// const initialState: UserInfo|null = null;

// 초기 상태 설정
const initialState: UserInfo | null = null as UserInfo | null;
;


export const userInfoSlice = createSlice({
    name: "loginUserInfo",
    initialState,
    reducers: {
      pushUserInfo: (state, action: PayloadAction<UserInfo>) => {
        // Immer를 사용하여 상태를 직접 수정
        const {email,nickName,profilePicture} = action.payload;
        return {
            email:email,
            nickName:nickName,
            profilePicture:profilePicture
        }
      },
      clearUserInfo: () => null  // 상태를 null로 초기화
    },
  });

// 액션 내보내기
export const { pushUserInfo,clearUserInfo } = userInfoSlice.actions;