import React, { useEffect,useState } from 'react';
import { useSelector } from 'react-redux';
import { modalSelector } from '../../store/modalSlice'; // modalSlice의 경로를 맞춰주세요
import Username from './typeOfModal/Username';
import EditProfile from './typeOfModal/EditProfile';
import Menu from './typeOfModal/Menu';
import DarkMode from './typeOfModal/DarkMode';
import FollowPopup from './typeOfModal/FollowPopup';
import ConfirmDelete from './typeOfModal/ConfirmDelete';
import SessionExpired from './typeOfModal/SessionExpired';
import useModal from '../../customHook/useModal';
import {createPortal} from 'react-dom';
import {useTheme} from '../../customHook/useTheme';
import ModalLayer from './ModalLayerType/ModalLayer';
import CreatePost from './typeOfModal/CreatePostReNew';
import LogOutConfirm from './typeOfModal/LogOutConfirm';
import EditPost from './typeOfModal/EditPost';
import ConfirmCloseModal from './typeOfModal/ConfirmClosedModal'
import PostMenu from './PopUpType/PostMenu';
import MenuOfMenuBar from './PopUpType/MenuOfMenuBar';
import HashTagPopup from './PopUpType/HashTagPopup';
import AccountInfo from './PopUpType/AccountInfo';
import NavbarMenu from './PopUpType/NavBarMenu';
import LikedUser from './typeOfModal/LikedUser';
import ConfirmRefresh from './typeOfModal/ConfirmRefresh';
import FloatingWrapper from './FloatingWrapper';
import GetLocation from './GetLocation';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';
import {  Bg_color_Type_3 , Bg_color_Type_1, Bg_color_Type_2} from '../../store/ColorAdjustion';
import useMediaQuery from '../../customHook/useMediaQuery';
// 모달 타입 정의
const MODAL_TYPES = {
  username: "username",
  createPost: "createPost",
  menu: "menu",
  darkMode:'darkMode',
  editProfile:'editProfile',
  followPopup:'followPopup',
  editPost:'editPost',
  confirmDelete:'confirmDelete',
  likedUser:'likedUser',
  sessionExpired:'sessionExpired',
  confirmRefresh:'confirmRefresh',
  logOutConfirm:'logOutConfirm',
  postMenu:'postMenu',
  menuOfMenuBar:'menuOfMenuBar',
  navbarMenu:'navbarMenu',
  hashTagPopup:'hashTagPopup',
  accountInfo:'accountInfo',
  confirmCloseModal:'confirmCloseModal'
} as const; // as const로 리터럴 타입으로 변환



type ModalType = typeof MODAL_TYPES[keyof typeof MODAL_TYPES]; // 'first' | 'second' 타입

const MODAL_COMPONENTS: Record<ModalType, React.FC<any>> = {
  username: Username,
  menu: Menu,
  createPost:CreatePost,
  darkMode:DarkMode,
  editProfile:EditProfile,
  followPopup:FollowPopup,
  editPost:EditPost,
  confirmDelete:ConfirmDelete,
  likedUser:LikedUser,
  sessionExpired:SessionExpired,
  confirmRefresh:ConfirmRefresh,
  logOutConfirm:LogOutConfirm,
  postMenu:PostMenu,
  menuOfMenuBar:MenuOfMenuBar,
  hashTagPopup:HashTagPopup,
  accountInfo:AccountInfo,
  navbarMenu:NavbarMenu,
  confirmCloseModal:ConfirmCloseModal
};

const ModalComponentReNew: React.FC = () => {

  const { isDark } = useTheme();
  const { closeModal, openModal,closeAllModal } = useModal();
  const Modals = useSelector(modalSelector);
  const [lastArrayIndex,setLastArrayIndex] = useState(-1)
  const isMobile = useMediaQuery('(max-width: 767px)');

  const FULLSCREEN_MODAL_TYPES: ModalType[] = ['postMenu','createPost', 'editPost', 'editProfile','likedUser','followPopup','confirmDelete','sessionExpired','confirmRefresh','logOutConfirm'];

  useEffect(()=>{
    console.log(Modals,isDark);
    const topmostModalState = Modals.length - 1;
    setLastArrayIndex(topmostModalState)
  },[Modals])
  
  if (!Modals || Modals.length === 0) {
    return null; // 모달이 없으면 null 반환
  }

  

  const closeCurrentModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>,  isForce?: boolean, isConfirmClosed?: boolean) => {
    // 클릭된 지점(e.target)이 오버레이 자신(e.currentTarget)일 때만 실행
    if (e.target === e.currentTarget) {
      if(isConfirmClosed){
        // 닫기 확인 모달만 열고, 현재 모달은 닫지 않음
        openModal({type:'confirmCloseModal', props:{isForce:true,isDark:isDark}})
      } else if (!isForce) {
        // 닫기 확인이 없을 때만 현재 모달 닫기
        closeModal();
      }
    }
  };



  return(
    <div>
      
    {Modals.map((modalState, index) => {
      const { type, props } = modalState;
      const ModalTypeKey = type as ModalType;
      const isFullScreenModal = isMobile && FULLSCREEN_MODAL_TYPES.includes(ModalTypeKey);
      const isTransParentBackground = isFullScreenModal ? false : props.isTransParentBackground;
      const isModalLayer = props.isModalLayer;
      const modalInfo = props.modal;
      const Modal = MODAL_COMPONENTS[ModalTypeKey];

      if (!Modal) {
        return null; // 정의되지 않은 Modal 타입 처리
      }
  

      const hasFixedHeight = Boolean(modalInfo?.height && modalInfo.height.startsWith('h-'));
      const mergedNavButtonOption = {
        ...(modalInfo?.navButtonOption ?? {}),
      };
      if (isFullScreenModal) {
        mergedNavButtonOption.isClose = true;
      }
      const overlayZIndex = 100 + index * 100;
      const isFullscreenMobileCloseType = isFullScreenModal && (ModalTypeKey === 'confirmCloseModal' || ModalTypeKey === 'confirmDelete'|| ModalTypeKey === 'sessionExpired'|| ModalTypeKey === 'logOutConfirm'|| ModalTypeKey === 'postMenu'); // 모바일 전체화면 모달 중 닫기 확인 모달과 삭제 확인 모달
      const overlayAlignment = isFullScreenModal
        ? (isFullscreenMobileCloseType ? 'items-end' : 'items-start')
        : 'items-center';
      const overlayClass = `fixed top-0 left-0 right-0 bottom-0 
      flex justify-center ${overlayAlignment} 
      transition-colors duration-300 ease-in-out
      ${
        !isTransParentBackground && lastArrayIndex === index
          ? "bg-gray-500 bg-opacity-50"
          : "bg-transparent" 
      }`;
      const effectiveModalInfo = {
        ...modalInfo,
        isFull: isFullScreenModal || modalInfo?.isFull,
        navButtonOption: Object.keys(mergedNavButtonOption).length ? mergedNavButtonOption : undefined,
      };
      const modalSizeClass = isFullScreenModal
        ? 'w-full max-w-none'
        : `${modalInfo?.width ?? ''} ${modalInfo?.height ?? 'h-auto'}`;
      const modalRadiusClass = isFullScreenModal ? (isFullscreenMobileCloseType ? 'rounded-2xl' : '') : 'rounded-xl';
      const modalOverflowClass = isFullScreenModal ? 'overflow-y-auto' : '';
      const modalContainerClass = (isFullScreenModal || hasFixedHeight)
        ? 'w-full flex flex-col'
        : '';
      const modalBackgroundClass = isFullscreenMobileCloseType
        ? `${Bg_color_Type_2(isDark)} flex justify-end items-end`
        : Bg_color_Type_3(isDark);
      const closeButtonColor = isDark ? 'text-white' : 'text-gray-800';
      const motionInitial = isFullScreenModal ? { opacity: 0 } : { opacity: 0, scale: 0 };
      const motionAnimate = isFullScreenModal ? { opacity: 1 } : { opacity: 1, scale: 1 };
      const motionExit = isFullScreenModal ? { opacity: 0 } : { opacity: 0, scale: 0 };
    
//       <div key={index} className={overlayClass} 
//       onClick={(e) => closeModalWhenClickBackground(e, props?.isForce)}>
// </div>
        // const modalRoot = document.getElementById(props.potalSpot);
        const modalRoot = document.getElementById('modal-root');
        if (!modalRoot) {
          return null; // modal-root가 없으면 null 반환
        }
        return createPortal(
          <>
    
 {/* </motion.div> */}
 <div key={index} className={overlayClass} style={{ zIndex: overlayZIndex }}
      onClick={(e) => closeCurrentModal(e, props?.isForce, props?.isConfirmClosed)}>

              {props.potalSpot ==='center'?
                <AnimatePresence >
                    <motion.div
                    onClick={(e)=>e.stopPropagation()}
                    className={`relative ${modalSizeClass} ${modalRadiusClass} ${modalOverflowClass} ${modalBackgroundClass}` }
                    initial={motionInitial}
                    animate={motionAnimate}
                    exit={motionExit}
                    transition={{ duration: 0.1 }}
                    style={{
                      position: isFullScreenModal ? 'relative' : 'fixed',
                      height: isFullScreenModal ? 'auto' : undefined,
                      // top: '50%',
                      // left: '50%',
                      // transform: 'translate(-50%, -50%)',
                      transformOrigin: 'center center',      // 좌 좌상단을 기준점으로
                      borderRadius: isFullScreenModal ? (isFullscreenMobileCloseType ? '16px' : 0) : undefined,
                    }}
                  >
            
                 

                            {isModalLayer?     
                      <ModalLayer {...effectiveModalInfo} isDark={isDark} isConfirmClosed={props?.isConfirmClosed}>
                      <Modal {...props} modal={modalInfo} isDark={isDark} isFullScreen={isFullScreenModal} />
                      </ModalLayer> :
                      <div className={modalContainerClass}>
                      <Modal {...props} modal={modalInfo} isDark={isDark} isFullScreen={isFullScreenModal} />
                      </div>
                      }

         
                 
                    
                    </motion.div>
          
                 </AnimatePresence>
               :
                <GetLocation potalSpot={props.potalSpot} >
                {isModalLayer? 
                <div onClick={(e)=>e.stopPropagation()}>
<ModalLayer {...effectiveModalInfo} isDark={isDark}>
                    <Modal {...props} modal={modalInfo} isDark={isDark} isFullScreen={isFullScreenModal} />
                    </ModalLayer>
                </div>
                    
                :
                <div onClick={(e)=>e.stopPropagation()} className={`relative ${modalSizeClass} ${modalRadiusClass}`} style={{ borderRadius: isFullScreenModal ? 0 : undefined }}>
                {isFullScreenModal && (
                  <button
                    type="button"
                    onClick={closeModal}
                    className={`absolute top-4 right-4 ${closeButtonColor} text-3xl`}
                    aria-label="close modal"
                  >
                    <IoCloseOutline />
                  </button>
                )}
                <Modal 
                {...props} modal={modalInfo} isDark={isDark} isFullScreen={isFullScreenModal} />
                </div>
              
                    }
                </GetLocation>
               }
              
            
</div>
          </>,
          modalRoot
        );

    })}
    </div>
  )
  };

export default ModalComponentReNew;
