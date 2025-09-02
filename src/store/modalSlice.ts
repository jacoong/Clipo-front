import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalInitial,ModalState,ModalStates } from "./types";
// Modal 상태의 인터페이스 정의


const initialState: ModalStates = [];

// 상태 선택자
export const modalSelector = (state: { modal: ModalStates }) => state.modal;

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ type: string; props: ModalInitial}>) => {
      const { type, props } = action.payload;
      state.push({type,props})
    },

    closeModal: (state) => {
      state.pop();
    },
    closeAllModal: (state) => {
      state.length = 0;
    },
  },
});

// 액션 내보내기
export const { openModal, closeModal, closeAllModal } = modalSlice.actions;