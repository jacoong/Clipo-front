import React, { useState } from 'react';
import { FaSearch, FaUser, FaRegUser } from 'react-icons/fa';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { GoHomeFill, GoHome, GoHeart, GoHeartFill } from "react-icons/go";
import { FaPlus } from "react-icons/fa";
import IconLink from './IconLink';
import { useTheme } from "../customHook/useTheme";
import { Font_color_Type_2 } from '../store/ColorAdjustion';
import { UserInfo } from '../store/types';
import useModal from '../customHook/useModal';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { COLOR } from '../store/ThemeColor';

interface MobileMenubarProps {
  userInfo: UserInfo | null;
  currentMenu: string;
  numberOfUnread: number;
}

const MobileMenubar = ({ userInfo, currentMenu, numberOfUnread }: MobileMenubarProps) => {
  const { isDark } = useTheme();
  const [showRecommendDropdown, setShowRecommendDropdown] = useState(false);
  const { openModal } = useModal();
  const loginUserInfo = useSelector((state: RootState) => state.loginUserInfo);

  const openPost = () => {
    const postInfoForm = {
      email: loginUserInfo?.email,
      nickName: loginUserInfo?.nickName,
      profilePicture: loginUserInfo?.profilePicture
    };
    openModal({ 
      type: 'createPost', 
      props: { 
        isConfirmClosed: true,
        isModalLayer: false,
        isForce: false,
        isDark: isDark,
        value: {
          postInfo: postInfoForm,
          mode: 'create',
        },
        modal: {
          width: 'w-104'
        }
      } 
    });
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${isDark ? 'bg-customBlack border-t border-gray-700' : 'bg-customWhite border-t border-gray-200'} flex justify-around items-center py-3 z-[99999] shadow-lg`}>
      <IconLink 
        isNofiticate={false} 
        to="/main" 
        isActivated={currentMenu === 'home'} 
        activeicon={GoHomeFill} 
        disActiveicon={GoHome} 
        iconSize='text-2xl'
      />
      <IconLink 
        isNofiticate={false} 
        to="/main/search" 
        isActivated={currentMenu === 'search'} 
        activeicon={FaSearch} 
        disActiveicon={FaSearch} 
        iconSize='text-2xl'
      />
      
      {/* + 버튼 (중앙) */}
      <div 
        className={`${isDark ? 'bg-customborderDarkGray hover:bg-themeColor' : 'bg-customborderLightGray hover:bg-themeColor'} text-white cursor-pointer duration-300 hover:scale-105 transition-all rounded-lg px-4 py-3`}
        onClick={openPost}
      >
        <FaPlus className='text-xl' />
      </div>
      
      <IconLink 
        isNofiticate={true} 
        to="/main/activity" 
        isActivated={currentMenu === 'activity'} 
        activeicon={GoHeartFill} 
        disActiveicon={GoHeart} 
        isShowNumber={false} 
        numberOfActive={numberOfUnread} 
        iconSize='text-2xl'
      />
      <IconLink 
        isNofiticate={false} 
        to={`/main/@/${userInfo?.nickName}`} 
        isActivated={currentMenu === 'profile'} 
        activeicon={FaUser} 
        disActiveicon={FaRegUser} 
        iconSize='text-2xl'
      />
      
    </div>
  );
};

export default MobileMenubar;
