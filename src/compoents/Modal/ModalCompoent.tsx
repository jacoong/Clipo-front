import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { modalSelector } from '../../store/modalSlice'; // modalSlice의 경로를 맞춰주세요
import Username from './typeOfModal/Username';
import Menu from './typeOfModal/Menu';
import DarkMode from './typeOfModal/DarkMode';
import useModal from '../../customHook/useModal';
import {createPortal} from 'react-dom';
import {useTheme} from '../../customHook/useTheme';
import ModalLayer from './ModalLayerType/ModalLayer';
// 모달 타입 정의
const MODAL_TYPES = {
  username: "username",
  menu: "menu",
  darkMode:'darkMode'
} as const; // as const로 리터럴 타입으로 변환

const POPUP_TYPES = {

} as const;

type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES]; // 'first' | 'second' 타입
type PopupType = typeof POPUP_TYPES[keyof typeof POPUP_TYPES]; // 'ViewEvent' | 'CategoryDelete' | ...

const MODAL_COMPONENTS: Record<ModalType, React.FC<any>> = {
  username: Username,
  menu: Menu,
  darkMode:DarkMode
};

const POPUP_COMPONENTS: Record<PopupType, React.ComponentType<any>> = {
};

const ModalComponent: React.FC = () => {

  const { isDark } = useTheme();
  const { closeModal } = useModal();
  const Modals = useSelector(modalSelector);



  useEffect(()=>{
  console.log(Modals,isDark);
  },[Modals])
  
  if (!Modals || Modals.length === 0) {
    return null; // 모달이 없으면 null 반환
  }

  const closeCurrentModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>,  isForce?: boolean) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    if (!isForce ) {
      closeModal();
    }
  };

  return(
    <>
    {Modals.map((modalState, index) => {
      const { type, props } = modalState;
      const isPopup = type === "Popup";
      const Modal = isPopup
        ? POPUP_COMPONENTS[props?.typeOfPopup as PopupType]
        : MODAL_COMPONENTS[type as ModalType];

      if (!Modal) {
        return null; // 정의되지 않은 Modal 타입 처리
      }

      const overlayClass = `z-50 fixed top-0 left-0 right-0 bottom-0 ${
        isPopup ? "bg-transparent" : "bg-gray-500 bg-opacity-50"
      } flex justify-center items-center`;

      if (props?.isPotal) {
        const modalRoot = document.getElementById(props.potalSpot);

        if (!modalRoot) {
          return null; // modal-root가 없으면 null 반환
        }

        return createPortal(
          <div key={index}>
            <div className={overlayClass} onClick={(e) => closeCurrentModal(e, props?.isForce)}></div>
            {isPopup?
             <Modal {...props} isDark={isDark} />:
             <ModalLayer {...props!.modal!}>
             <Modal {...props} isDark={isDark} />
             </ModalLayer>
            }
          </div>,
          modalRoot
        );
      } else {
        return (
          <div key={index} className={overlayClass} onClick={(e) => closeCurrentModal(e, props?.isForce)}>
      {isPopup?
             <Modal {...props} isDark={isDark} />:
             <ModalLayer {...props!.modal!}>
             <Modal {...props} isDark={isDark} />
             </ModalLayer>
            }
          </div>
        );
      }
    })}
  </>
  )
  };

export default ModalComponent;
