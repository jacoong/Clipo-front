import { useDispatch } from "react-redux";
import { openModal, closeModal, closeAllModal } from "../store/modalSlice";
import {ModalInitial} from '../store/types';
import { useTheme } from "../customHook/useTheme";
// 모달 열기 함수의 매개변수 타입 정의
interface OpenModalProps {
  type: string;
  props?: ModalInitial; // props의 타입을 필요에 따라 정의
}

function useModal() {

  const { isDark } = useTheme();

  const dispatch = useDispatch();
  const handleOpenModal = ({ type, props }: OpenModalProps) => {
    console.log('props',props,'type:',type)
    dispatch(openModal({ type, props:
      props = {
        ...props, // 기존의 props를 유지
        isDark:isDark,
        isModalLayer: props?.isModalLayer ?? false, // 명시되지 않았다면 기본값 false
        isTransParentBackground: props?.isTransParentBackground ?? false, // 명시되지 않았다면 기본값 false
        isForce: props?.isForce ?? false, // 명시되지 않았다면 기본값 false
        isConfirmClosed: props?.isConfirmClosed ?? false,
        potalSpot: props?.potalSpot ?? 'center',
        modal: {
          width:props?.modal?.width ?? 'auto',
          height:props?.modal?.height ?? 'auto',
          isFull: props?.modal?.isFull ?? false,
          isCenterMessage:props?.modal?.isCenterMessage ?? undefined,
          navButtonOption: {
            isClose: props?.modal?.navButtonOption?.isClose ?? true,
            isEdit: props?.modal?.navButtonOption?.isEdit ?? false,
            isDelete: props?.modal?.navButtonOption?.isDelete ?? false,
          },
        }
      }
    }));
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleCloseAllModal = () => {
    dispatch(closeAllModal());
  };

  return { openModal: handleOpenModal, closeModal: handleCloseModal, closeAllModal: handleCloseAllModal };
}

export default useModal;
