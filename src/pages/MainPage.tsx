import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link,useLocation } from 'react-router-dom'; // If yo
import { instance } from '../store/axios_context'
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { BiSolidHomeCircle } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import style from './pageCss/MainPage.module.css'
import Menubar from '../compoents/Menubar';
import MainContainer from '../compoents/MainContainer';
import useModal from '../customHook/useModal';
import {getUserProfile} from '../customHook/useLoadState';
import Services from '../store/ApiService'
import {simpleUserInfo,flashMessageType} from '../store/types';
import Loading from './pageModule/pageKit/Loading';
import { useMutation } from "react-query";
import { useTheme } from "../customHook/useTheme"
import { useSelector, useDispatch } from 'react-redux';
import { pushUserInfo,clearUserInfo } from '../store/loginUserInfoSlice';
import {UserInfo,flashMessageValue} from '../store/types';
import FlashMessage from '../compoents/FlashMessage';
import { useFlashMessage } from '../customHook/useFlashMessage';
import {getCookie, removeCookie} from '../store/coockie';
import useNavigateUnAuthenticatedUser from '../customHook/useNavigateUnAuthenticatedUser';
// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }


const menuItems = [
  { name: "Home", icon: <BiSolidHomeCircle />, link: "/" },
  { name: "Explore", icon: <AiOutlineUser />, link: "/explore" },
  { name: "Notifications", icon: <AiOutlineUser />, link: "/notifications" },
  { name: "Messages", icon: <AiOutlineUser />, link: "/messages" },
  { name: "Lists", icon: <AiOutlineUser />, link: "/lists" },
  { name: "Communities", icon: <AiOutlineUser />, link: "/communities" },
  { name: "Verified", icon: <AiOutlineUser />, link: "/verified" },
  { name: "More", icon: <AiOutlineUser />, link: "/more" },
];

const { UserService,SocialService } = Services;


function MainPage() {
        const { isDark } = useTheme();
        const navigate = useNavigate();
        const [loading, setLoading] = useState(true);
        const [isShowedMainPage, setIsShowedMainPage] = useState<boolean>(false);
        const [flashMessageInfo, setFlashMessageInfo] = useState<flashMessageValue|null>(null);
        // const [userInfo,setUserInfo] = useState<UserType>()
        const [userInfo,setUserInfo] = useState<UserInfo|null>(null)
        const {flashMessage,showFlashMessage} = useFlashMessage();
        const savedData:any = localStorage.getItem('userDataKey'); 
        const userId = JSON.parse(savedData);
        const { openModal } = useModal();
        const location = useLocation();
        const navigateUnAuthenticatedUser = useNavigateUnAuthenticatedUser();
        const dispatch = useDispatch();


        const navigateUserIfUserHadPreviousUrl = ()=>{
            const previousUrl = localStorage.getItem('previousUrl');
            if(previousUrl){
              navigate(previousUrl);
              localStorage.removeItem('previousUrl');
            }else{
              console.log('no previous URL')
              return
            }
        }


        const { data: userProfile, isLoading, isError,refetch:userProfileRefetch } = useQuery<simpleUserInfo, AxiosError<{ message: string }>>(
          'userProfile', // 쿼리 키: 캐싱할 때 사용할 고유 식별자
          () => UserService.getUserProfile(), // 데이터를 가져오는 함수
          {
            onSuccess: (data) => {
              console.log('User Profile Data:', data);
              navigateUserIfUserHadPreviousUrl();
              // 로그인 상태를 업데이트
              isUserLogin(data);
              setLoading(false);
            },
            onError: (error: AxiosError) => {
              console.log(error, '에러 콘솔');
              return
            },
          }
        );


        const isUserLogin = (data:simpleUserInfo) =>{
          const simpleUserData = data.body;
          setUserInfo(simpleUserData);
          dispatch(pushUserInfo(simpleUserData));
          if(simpleUserData){
            console.log(simpleUserData,'simpleUserData value');
            checkUserName(simpleUserData.nickName);
          }
        }

        const checkUserName = (nickname:string|null) =>{   
          if(nickname === null){
            openUsername();
          }else{
            setIsShowedMainPage(true)
            return
          }
        }

         const openUsername = () => {
          openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
        };

        // openUsername();
  

        const isUserHadToken = () => {
          const refreshToken = getCookie('refreshToken');  //check user even had old ref
          const accessToken = getCookie('accessToken');  //check user even had old ref
          if(refreshToken){
            if(refreshToken==='expiredToken'){
              openModal({ type:'sessionExpired', props: {isForce:true} });
              return
            }
          }else{
            executeUnAuthenticateUser(); //should turn on 
          }
        }

        const executeUnAuthenticateUser = () => {
          const currentURL = location.pathname; 
          navigateUnAuthenticatedUser(currentURL);
        }
        
        useEffect(()=>{
          isUserHadToken()
        },[])

  
        useEffect(() => {
          if (flashMessage.flashMessageValue !== null) { //if flashMessage is exist
            setFlashMessageInfo(flashMessage.flashMessageValue)
            // 추가 작업: 알림 표시, 로그 저장 등
          }else{
            setFlashMessageInfo(null)
          }
          console.log("Flash message updated:", flashMessage);
        }, [flashMessage]); 



          return (
            <>
                <FlashMessage value={flashMessageInfo}/>
                <div className={`overflow-auto relative z-10 w-full h-screen flex box-border ${isDark ? 'bg-customBlack' : 'bg-customWhite'}` }>
                <Loading isLoaded={loading}/>
                  {
                    isShowedMainPage
                    ?
                    <>
                    <div className='fixed h-lvh'>
                    <Menubar userInfo={userInfo}/>
                    </div>
                    <div className='w-full h-lvh sm:w-116 mx-auto relative'>
                        <MainContainer>
                          <Outlet />
                        </MainContainer>
                    </div>
                    </>
                    :
                    <div className='w-full h-full'>
                    </div>
                  }
                
                </div>
                
            </>
          );
  }
    
export default MainPage;
