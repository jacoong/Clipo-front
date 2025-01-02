import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { navInfoType } from "./types";
// Modal 상태의 인터페이스 정의


// const initialState: UserInfo|null = null;
const initialStateValue = {titleValue:'회원님을 위한 추천',subTitleValue:null,value:null}
// 초기 상태 설정
const initialState: navInfoType = initialStateValue;
;


export const infoNavSlice = createSlice({
    name: "infoOfNav",
    initialState,
    reducers: {
      updateNavInfo: (state, action: PayloadAction<navInfoType>) => {
        // Immer를 사용하여 상태를 직접 수정
        const {titleValue,subTitleValue,value} = action.payload;
        return {
            titleValue:titleValue,
            subTitleValue:subTitleValue,
            value:value
        }
      }
    },
  });

// 액션 내보내기
export const { updateNavInfo } = infoNavSlice.actions;