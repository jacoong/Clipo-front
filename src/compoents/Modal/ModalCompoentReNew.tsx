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
import { Bg_color_Type_2 } from '../../store/ColorAdjustion';
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
  navbarMenu:NavbarMenu
};

const ModalComponentReNew: React.FC = () => {

  const { isDark } = useTheme();
  const { closeModal } = useModal();
  const Modals = useSelector(modalSelector);
  const [lastArrayIndex,setLastArrayIndex] = useState(-1)

  useEffect(()=>{
    console.log(Modals,isDark);
    const topmostModalState = Modals.length - 1;
    setLastArrayIndex(topmostModalState)
  },[Modals])
  
  if (!Modals || Modals.length === 0) {
    return null; // 모달이 없으면 null 반환
  }

  

  const closeCurrentModal = (e: React.MouseEvent<HTMLDivElement, MouseEvent>,  isForce?: boolean) => {
    // 클릭된 지점(e.target)이 오버레이 자신(e.currentTarget)일 때만 실행
    if (e.target === e.currentTarget) {
      if (!isForce) {
        closeModal();
      }
    }
  };



  return(
    <div>
      
    {Modals.map((modalState, index) => {
      const { type, props } = modalState;
      const isTransParentBackground = props.isTransParentBackground;
      const isModalLayer = props.isModalLayer;
      const modalInfo = props.modal;
      const Modal = MODAL_COMPONENTS[type as ModalType];

      if (!Modal) {
        return null; // 정의되지 않은 Modal 타입 처리
      }
  


      const overlayClass = `z-${index*10} fixed top-0 left-0 right-0 bottom-0 
      flex justify-center items-center 
      transition-colors duration-300 ease-in-out
      ${
        !isTransParentBackground && lastArrayIndex === index
          ? "bg-gray-500 bg-opacity-50"
          : "bg-transparent" 
      }`;
    
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
 <div key={index} className={overlayClass}
      onClick={(e) => closeCurrentModal(e, props?.isForce)}>

              {props.potalSpot ==='center'?
                <AnimatePresence >
                    <motion.div
                    onClick={(e)=>e.stopPropagation()}
                    className={`${modalInfo?.width} h-auto rounded-xl ${Bg_color_Type_2(isDark)}` }
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.1 }}
                    style={{
                      position: 'fixed',
                      // top: '50%',
                      // left: '50%',
                      // transform: 'translate(-50%, -50%)',
                      transformOrigin: 'center center',      // 좌 좌상단을 기준점으로
                    }}
                  >
            
                            {isModalLayer?     
                      <ModalLayer {...props!.modal!} isDark={isDark}>
                      <Modal {...props} isDark={isDark} />
                      </ModalLayer> :
                      <div className='p-2'>
                      <Modal {...props} isDark={isDark} />
                      </div>
                      }

          
                 
                    
                    </motion.div>
          
                 </AnimatePresence>
               :
                <GetLocation potalSpot={props.potalSpot} >
                {isModalLayer? 
                <div onClick={(e)=>e.stopPropagation()}>
<ModalLayer {...props!.modal!} isDark={isDark}>
                    <Modal {...props} isDark={isDark} />
                    </ModalLayer>
                </div>
                    
                :
                <div onClick={(e)=>e.stopPropagation()} className={`w-auto h-auto rounded-xl`}>
                <Modal 
                {...props} isDark={isDark} />
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