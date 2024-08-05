import React from 'react';
import { useSelector } from 'react-redux';
import { modalSelector } from '../../store/modalSlice'; // modalSlice의 경로를 맞춰주세요
import Username from './typeOfModal/Username';
import Menu from './typeOfModal/Menu';
import DarkMode from './typeOfModal/DarkMode';
import useModal from '../../customHook/useModal';
import {createPortal} from 'react-dom';
import {useTheme} from '../../customHook/useTheme';
// 모달 타입 정의
const MODAL_TYPES = {
  username: "username",
  menu: "menu",
  darkMode:'darkMode'
} as const; // as const로 리터럴 타입으로 변환

type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES]; // 'first' | 'second' 타입

const MODAL_COMPONENTS: Record<ModalType, React.FC<any>> = {
  username: Username,
  menu: Menu,
  darkMode:DarkMode
};

const ModalComponent: React.FC = () => {

  const { isDark } = useTheme();
  const { closeModal } = useModal();
  const { type, props } = useSelector(modalSelector);


  const overlayClass = true ? "z-50 fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center" : "fixed top-0 left-0 right-0 bottom-0 bg-transparent flex justify-center items-center";
  
  if (!type) {
    return null; // 모달이 없을 경우 null 반환
  } else {
    const Modal = MODAL_COMPONENTS[type as ModalType];
    console.log(Modal,type)
    if (!Modal) {
      return null; // 타입이 유효하지 않을 경우 null 반환
    }

    const closeCurrentModal = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation(); // 클릭 이벤트가 전파되지 않도록 함
        if(props.isForce){
          return
        }
        closeModal();
    };



    if (props.isPotal) {
      const modalRoot = document.getElementById(type);
  
      if (!modalRoot) {
        return null; // modal-root가 없으면 null 반환
      }
      return createPortal(
        <>
          <div className={overlayClass} onClick={closeCurrentModal}></div>
          <Modal {...props} isDark={isDark}/>
        </>,
        modalRoot
      );
    } else {
      return (
        <>
          <div className={overlayClass} onClick={closeCurrentModal}>
          <Modal {...props} isDark={isDark}/>
          </div>
        </>
      );
    }
    }

    // return (
    //   <>
    //   <div className={overlayClass} onClick={closeCurrentModal}>
    //   </div>
    //   <Modal {...props} />
    //   </>
    // );


   
  };

export default ModalComponent;
