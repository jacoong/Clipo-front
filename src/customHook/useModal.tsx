import { useDispatch } from "react-redux";
import { openModal, closeModal } from "../store/modalSlice";
import {ModalInitial} from '../store/types';
// 모달 열기 함수의 매개변수 타입 정의
interface OpenModalProps {
  type: string;
  props?: ModalInitial; // props의 타입을 필요에 따라 정의
}

function useModal() {
  const dispatch = useDispatch();
  console.log('ss')
  const handleOpenModal = ({ type, props }: OpenModalProps) => {
    dispatch(openModal({ type, props:
      props = {
        ...props, // 기존의 props를 유지
        isPotal: props?.isPotal ?? false, // 명시되지 않았다면 기본값 false
        isForce: props?.isForce ?? false, // 명시되지 않았다면 기본값 false
        potalSpot: props?.isPotal ? (props?.potalSpot || props?.typeOfPopup) : null,
        modal: {
          width:props?.modal?.width ?? 'auto',
          height:props?.modal?.height ?? 'auto',
          isFull: props?.modal?.isFull ?? false,
          isCenterMessage:props?.modal?.isCenterMessage ?? undefined,
          navButtonOption: {
            isClose: props?.modal?.navButtonOption?.isClose ?? false,
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

  return { openModal: handleOpenModal, closeModal: handleCloseModal };
}

export default useModal;
