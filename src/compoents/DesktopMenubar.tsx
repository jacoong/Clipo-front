import React, { useRef } from 'react';
import { FaSearch, FaUser, FaRegUser } from 'react-icons/fa';
import { BsPin } from 'react-icons/bs';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { GoHomeFill, GoHome, GoHeart, GoHeartFill } from "react-icons/go";
import IconLink from './IconLink';
import { useTheme } from "../customHook/useTheme";
import useModal from '../customHook/useModal';
import { Font_color_Type_2 } from '../store/ColorAdjustion';
import { UserInfo } from '../store/types';
import MobileCreatePostButton from './MobileCreatePostButton';

interface DesktopMenubarProps {
  userInfo: UserInfo | null;
  currentMenu: string;
  numberOfUnread: number;
}

const DesktopMenubar = ({ userInfo, currentMenu, numberOfUnread }: DesktopMenubarProps) => {
  const { isDark } = useTheme();
  const { openModal } = useModal();
  const triggerRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    openModal({ 
      type: 'menuOfMenuBar', 
      props: { 
        isTransParentBackground: true,
        potalSpot: { 
          top: rect.bottom + window.scrollY, 
          left: rect.left + window.scrollX 
        } 
      }
    });
  };

  return (
    <div className="fixed top-0 left-0 w-20 min-w-[5rem] h-screen text-whitze flex flex-col items-center py-4 z-0">
      <div className="mb-8 mt-4">
        {/* 로고 이미지 */}
        <img src="/logo3.png" alt="Logo" className="h-8 w-8" />
      </div>

      <div className='flex flex-col justify-center gap-2 flex-grow '>
        <IconLink 
          isNofiticate={false} 
          to="/main" 
          isActivated={currentMenu === 'home'} 
          activeicon={GoHomeFill} 
          disActiveicon={GoHome} 
          iconSize='text-3xl'
        />
        <IconLink 
          isNofiticate={false} 
          to="/main/search" 
          isActivated={currentMenu === 'search'} 
          activeicon={FaSearch} 
          disActiveicon={FaSearch} 
        />


      {/* + 버튼 (중앙) */}
      <MobileCreatePostButton isDark={isDark} />

        <IconLink 
          isNofiticate={true} 
          to="/main/activity" 
          isActivated={currentMenu === 'activity'} 
          activeicon={GoHeartFill} 
          disActiveicon={GoHeart} 
          isShowNumber={false} 
          numberOfActive={numberOfUnread}
        />
        <IconLink 
          isNofiticate={false} 
          to={`/main/@/${userInfo?.nickName}`} 
          isActivated={currentMenu === 'profile'} 
          activeicon={FaUser} 
          disActiveicon={FaRegUser} 
        />
      </div>

      <div className="mb-8 space-y-8">
        <div className={`${Font_color_Type_2(isDark)} cursor-pointer duration-300 ${isDark?'hover:text-hoverLightGray':'hover:text-hovercustomBlack'}`}>
          <BsPin className={`text-2xl`}></BsPin>
        </div>

        <div 
          ref={triggerRef} 
          onClick={openMenu} 
          className={`${Font_color_Type_2(isDark)} cursor-pointer duration-300 ${isDark?'hover:text-hoverLightGray':'hover:text-hovercustomBlack'}`}
        >
          <HiOutlineMenuAlt2 className='text-2xl'></HiOutlineMenuAlt2>
        </div>
      </div>
    </div>
  );
};

export default DesktopMenubar;
