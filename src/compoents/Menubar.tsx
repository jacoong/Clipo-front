import React,{useState,useEffect,useRef} from 'react';
import {useParams,useLocation, BrowserRouter} from 'react-router-dom';
import {UserInfo} from '../store/types';
import {RootState} from '../store/index';
import {useSelector} from 'react-redux';
import Services from '../store/ApiService'
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import useNavInfo from '../customHook/useNavInfo';
import useMediaQuery from '../customHook/useMediaQuery';
import MobileMenubar from './MobileMenubar';
import DesktopMenubar from './DesktopMenubar';
interface typeOfMenubar {
  userInfo:UserInfo|null;
}

const Menubar = ({userInfo}:typeOfMenubar) => {
  const { updateNavInfo } = useNavInfo();
  const {username} = useParams();
  const location = useLocation();
  const [currentMenu, setCurrentMenu] = useState('');
  const [numberOfUnread,setNumberOfUnread] = useState<number>(0);
  const infoNav = useSelector((state:RootState) => state.infoNavSlice);
  
  // 모바일 감지
  const isMobile = useMediaQuery("(max-width: 768px)");


  const { UserService,SocialService } = Services;

      const { data: isReadNumber, isLoading, isError,refetch:userProfileRefetch } = useQuery(
        'isReadNumber', // 쿼리 키: 캐싱할 때 사용할 고유 식별자
        () => SocialService.isReadInitial(), // 데이터를 가져오는 함수
        {
          retry: false, // 세션 만료 시 재시도 방지
          refetchOnWindowFocus: false, // false로 설정
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
  console.log({type:infoNav.type,titleValue:infoNav.titleValue,value:infoNav.value});
  updateNavInfo({type:infoNav.type,titleValue:infoNav.titleValue,value:infoNav.value})
},[numberOfUnread])




    return (
      <>
        {isMobile ? (
          <MobileMenubar 
            userInfo={userInfo}
            currentMenu={currentMenu}
            numberOfUnread={numberOfUnread}
          />
        ) : (
          <DesktopMenubar 
            userInfo={userInfo}
            currentMenu={currentMenu}
            numberOfUnread={numberOfUnread}
          />
        )}
      </>
        )
    }

export default Menubar