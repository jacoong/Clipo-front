import React,{useState,useEffect,useRef} from 'react';
import { FaHome, FaSearch, FaHeart, FaUser, FaRegUser } from 'react-icons/fa';
import { BsPin } from 'react-icons/bs';
import IconLink from './IconLink';
import {useParams,useLocation, BrowserRouter} from 'react-router-dom';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { GoHomeFill,GoHome,GoHeart,GoHeartFill } from "react-icons/go";
import { useTheme } from "../customHook/useTheme"
import useModal from '../customHook/useModal';
import { current } from '@reduxjs/toolkit';
import {UserInfo} from '../store/types';

interface typeOfMenubar {
  userInfo:UserInfo|null;
}

const Menubar = ({userInfo}:typeOfMenubar) => {
  const { openModal } = useModal();
  const { isDark } = useTheme();
  const {username} = useParams();
  const location = useLocation();
  const [currentMenu, setCurrentMenu] = useState('');

  const divRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    openModal({ type:'Popup', props: { isPotal:true,typeOfPopup:'menuOfMenuBar'} });
  };

  useEffect(() => {
  const path = location.pathname;

  if (path === '/main' || path === '/main/') {
    setCurrentMenu('home');
  } else if (path.startsWith('/main/search')) {
    setCurrentMenu('search');
  } else if (path.startsWith('/main/activity')) {
    setCurrentMenu('activity');
  } else if (path.startsWith('/main/@/')) {
    setCurrentMenu('profile');
  } else {
    setCurrentMenu('');
  }
}, [location]);

    return (
      <div className="relative z-10 w-20 h-full text-whitze flex flex-col items-center py-4">
      <div className="mb-8 mt-4">
        {/* 로고 이미지 */}
        <img src="/logo3.png" alt="Logo" className="h-8 w-8" />
      </div>

      <div className='flex flex-col justify-center gap-2 flex-grow '>
      <IconLink to="/main" isActivated={currentMenu === 'home'} activeicon={GoHomeFill} disActiveicon={GoHome} iconSize='text-3xl'/>
      <IconLink to="/main/search" isActivated={currentMenu === 'search'} activeicon={FaSearch} disActiveicon={FaSearch} />
      <IconLink to="/main/activity" isActivated={currentMenu === 'activity'} activeicon={GoHeartFill} disActiveicon={GoHeart} />
      <IconLink to={`/main/@/${userInfo?.nickName}`} isActivated={currentMenu === 'profile'} activeicon={FaUser} disActiveicon={FaRegUser} />
      </div>



      <div className="mb-8 space-y-8">
        <div className={`${isDark?'text-customLightGray':'text-customGray'} cursor-pointer duration-300 ${isDark?'hover:text-hoverLightGray':'hover:text-hovercustomBlack'}`}>
              <BsPin className={`text-2xl`}></BsPin>
          </div>

          {/* <div className='absolute bg-cyan-400 h-4 w-56'>
            <div ref={divRef} id='menuOfMenuBar' className='flex-auto'></div>
          </div> */}
          <div id='menuOfMenuBar' onClick={openMenu} className={`${isDark?'text-customLightGray':'text-customGray'} cursor-pointer duration-300 ${isDark?'hover:text-hoverLightGray':'hover:text-hovercustomBlack'}`}>
              <HiOutlineMenuAlt2 className='text-2xl'></HiOutlineMenuAlt2>
          </div>
      </div>

    </div>
        )
    }

export default Menubar