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
import {RootState} from '../store/index';
import {useSelector} from 'react-redux';
import Services from '../store/ApiService'
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import useNavInfo from '../customHook/useNavInfo';
interface typeOfMenubar {
  userInfo:UserInfo|null;
}

const Menubar = ({userInfo}:typeOfMenubar) => {
  const { updateNavInfo } = useNavInfo();
  const { openModal } = useModal();
  const { isDark } = useTheme();
  const {username} = useParams();
  const location = useLocation();
  const triggerRef = useRef<HTMLDivElement>(null);
  const [currentMenu, setCurrentMenu] = useState('');
  const [numberOfUnread,setNumberOfUnread] = useState<number>(0);
  const divRef = useRef<HTMLDivElement>(null);
  const infoNav = useSelector((state:RootState) => state.infoNavSlice);
  // const openMenu = () => {
  //   openModal({ type:'Popup', props: { isPotal:true,typeOfPopup:'menuOfMenuBar'} });
  // };


  const openMenu = () => {
    if (!triggerRef.current) return;
    // 2) getBoundingClientRect()로 x,y, width, height 등을 구한다.
    const rect = triggerRef.current.getBoundingClientRect();
    // 예를 들어, 팝업을 버튼 바로 “밑에” 띄우고 싶으면:
    // setCoords({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    openModal({ type:'Popup', props: { isPotal:true,typeOfPopup:'menuOfMenuBar',potalSpot:{ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX } }});
  };


  const { UserService,SocialService } = Services;

      const { data: isReadNumber, isLoading, isError,refetch:userProfileRefetch } = useQuery(
        'isReadNumber', // 쿼리 키: 캐싱할 때 사용할 고유 식별자
        () => SocialService.isReadInitial(), // 데이터를 가져오는 함수
        {
          onSuccess: (data) => {
            console.log('isReadNumber Data:', data.body);
            setNumberOfUnread(data.body)
          },
          onError: (error: AxiosError) => {
            console.log(error, '에러 콘솔');
            return
          },
        } 
      );


//   useEffect(() => {
//   const path = location.pathname;

//   if (path === '/main' || path === '/main/') {
//     setCurrentMenu('home');
//   } else if (path.startsWith('/main/search')) {
//     setCurrentMenu('search');
//   } else if (path.startsWith('/main/activity')) {
//     setCurrentMenu('activity');
//   } else if (path.startsWith('/main/@/')) {
//     setCurrentMenu('profile');
//   } else {
//     setCurrentMenu('');
//   }
// }, [location]);

// useEffect(() => {
//   const path = location.pathname;

//   if (path === '/main' || path === '/main/') {
//     setCurrentMenu('home');
//   } else if (path.startsWith('/main/search')) {
//     setCurrentMenu('search');
//   } else if (path.startsWith('/main/activity')) {
//     setCurrentMenu('activity');
//   } else if (path.startsWith('/main/@/')) {
//     setCurrentMenu('profile');
//   } else {
//     setCurrentMenu('');
//   }
// }, [location]);


useEffect(() => {

  console.log(infoNav,'info nave')
  const type = infoNav.type;

    

  if (type === 'main') {
    setCurrentMenu('home');
  } else if (type === 'search') {
    setCurrentMenu('search');
  } else if (type === 'activity') {
    setCurrentMenu('activity');
  } else if (type === 'profile') {
    setCurrentMenu('profile');
  } else if(type === 'thread'){
    setCurrentMenu('thread')
  }
  else {
    setCurrentMenu('');
  }


}, [infoNav.type]);

useEffect(()=>{
  const type = infoNav.type;
  if(type === 'recommandationForYou'){
    return 
  }
  console.log({type:infoNav.type,titleValue:infoNav.titleValue,value:{isReadNumber:numberOfUnread}});
  updateNavInfo({type:infoNav.type,titleValue:infoNav.titleValue,value:{isReadNumber:numberOfUnread}})
},[numberOfUnread])






    return (
      <div className="relative w-20 h-full text-whitze flex flex-col items-center py-4">
      <div className="mb-8 mt-4">
        {/* 로고 이미지 */}
        <img src="/logo3.png" alt="Logo" className="h-8 w-8" />
      </div>

      <div className='flex flex-col justify-center gap-2 flex-grow '>
      <IconLink isNofiticate={false} to="/main" isActivated={currentMenu === 'home'} activeicon={GoHomeFill} disActiveicon={GoHome} iconSize='text-3xl'/>
      <IconLink isNofiticate={false} to="/main/search" isActivated={currentMenu === 'search'} activeicon={FaSearch} disActiveicon={FaSearch} />
      <IconLink isNofiticate={true} to="/main/activity" isActivated={currentMenu === 'activity'} activeicon={GoHeartFill} disActiveicon={GoHeart} isShowNumber={false} numberOfActive={numberOfUnread}/>
      <IconLink isNofiticate={false} to={`/main/@/${userInfo?.nickName}`} isActivated={currentMenu === 'profile'} activeicon={FaUser} disActiveicon={FaRegUser} />
      </div>



      <div className="mb-8 space-y-8">
        <div className={`${isDark?'text-customLightGray':'text-customGray'} cursor-pointer duration-300 ${isDark?'hover:text-hoverLightGray':'hover:text-hovercustomBlack'}`}>
              <BsPin className={`text-2xl`}></BsPin>
          </div>

          {/* <div className='absolute bg-cyan-400 h-4 w-56'>
            <div ref={divRef} id='menuOfMenuBar' className='flex-auto'></div>
          </div> */}
          <div ref={triggerRef} onClick={openMenu} className={`${isDark?'text-customLightGray':'text-customGray'} cursor-pointer duration-300 ${isDark?'hover:text-hoverLightGray':'hover:text-hovercustomBlack'}`}>
              <HiOutlineMenuAlt2 className='text-2xl'></HiOutlineMenuAlt2>
          </div>
      </div>

    </div>
        )
    }

export default Menubar