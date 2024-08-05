import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalInitial } from "./types";
// Modal 상태의 인터페이스 정의
export interface ModalState {
  type: string | null;
  props: ModalInitial; // props의 타입을 필요에 따라 정의
}

const initialState: ModalState = {
  type: null,
  props:{isPotal:false,isForce:false},
};

// 상태 선택자
export const modalSelector = (state: { modal: ModalState }) => state.modal;

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ type: string; props: ModalInitial}>) => {
      const { type, props } = action.payload;
      state.type = type;
      state.props = props;
    },
    closeModal: (state) => {
      return initialState;
    },
  },
});

// 액션 내보내기
export const { openModal, closeModal } = modalSlice.actions;