import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link,useLocation } from 'react-router-dom'; // If yo
import { instance } from '../store/axios_context'
import { modalSelector } from '../store/modalSlice';
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
import {simpleUserInfo,flashMessageType,activityDetailTypeaa,activityType} from '../store/types';
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
import ModalComponent from '../compoents/Modal/ModalCompoent';
import { activityDetailType } from '../store/types';
import usePushNotification from '../customHook/usePushNotification';

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
        const { fireNotificationWithTimeout } = usePushNotification();
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
        const Modals = useSelector(modalSelector);
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


        const { data: userProfile, isLoading, isError,refetch:userProfileRefetch } = useQuery<simpleUserInfo, any>(
          'userProfile', // 쿼리 키: 캐싱할 때 사용할 고유 식별자
          () => UserService.getUserProfile(), // 데이터를 가져오는 함수
          {
            retry: false, // 세션 만료 시 재시도 방지
            onSuccess: (data) => {
              console.log('User Profile Data:', data);
              navigateUserIfUserHadPreviousUrl();
              // 로그인 상태를 업데이트
              isUserLogin(data);
              setLoading(false);
            },
            onError: (error: any) => {
              console.log(error, '에러 콘솔');
              setLoading(false);
              
              // 세션 만료 에러 체크
              if (error.code === 'SESSION_EXPIRED') {
                console.log('세션 만료 에러')
                openModal({ type:'sessionExpired', props: {isForce:true} });
                // 세션 만료 시 메인페이지 표시 안함
                return;
              }
              
              // 다른 에러의 경우에만 메인페이지 표시
              setIsShowedMainPage(true);
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
            navigate('/enrollUsername')
          }else{
            setIsShowedMainPage(true)
            return
          }
        }



        // openUsername();
  
        useEffect(()=>{
          if(userProfile){
            setIsShowedMainPage(true)
          }
        },[userProfile])
   

        const executeUnAuthenticateUser = () => {
          const currentURL = location.pathname; 
          navigateUnAuthenticatedUser(currentURL);
        }
        
        useEffect(()=>{
          // inital unread activity api run here
          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission !== 'granted') {
              try {
                Notification.requestPermission().then((permission) => {
                  if (permission !== 'granted') return;
                });
              } catch (error) {
                if (error instanceof TypeError) {
                  Notification.requestPermission().then((permission) => {
                    if (permission !== 'granted') return;
                  });
                } else {
                  console.error(error);
                }
              }
            }
          }
        },[])

    


         useEffect(() => {
          if(!userInfo?.email){
            return
          }
          console.log(userInfo,'see')
          const eventSource = new EventSource(`http://localhost:8080/api/notification/activity/subscribe/${userInfo.email}`);
          
          eventSource.onopen = () => {
            console.log("SSE 연결 성공!");
          };
          
          eventSource.onmessage = (event) => {
            const newActivityValue: activityDetailTypeaa = JSON.parse(event.data);
            console.log('very important!',newActivityValue)
            fireNotificationWithTimeout({
              data: {
                nno:newActivityValue.nno,
                type: newActivityValue.type as activityType,
                from: newActivityValue.from,
                bno: newActivityValue.bno ?? null,
                rno: newActivityValue.rno ?? null,
                nestRe: newActivityValue.nestRe ?? null,
              },
            });
            
            
          };

          eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            eventSource.close();
          };

          return () => {
            eventSource.close();
          };
        }, [userInfo]);


  
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
            <div>
        
                <FlashMessage value={flashMessageInfo}/>
                <Loading isLoaded={loading}/>
                  {
                    isShowedMainPage
                    ?
                    <div>
                    <div className='w-auto fixed top-0 left-0 h-screen overflow-y-auto'>
                    <Menubar userInfo={userInfo}/>
                    </div>
                    {/* <div className={`overflow-auto relative z-10 w-full h-screen flex box-border ${isDark ? 'bg-customBlack' : 'bg-customWhite'}` }> */}
                    <div className='w-full sm:w-116 mx-auto relative'>
                        <MainContainer isDark={isDark}>
                          <Outlet />
                        </MainContainer>
                    </div>
                    {/* </div> */}
                    </div>
                    :
                    <>dk</>
                  }
                
                
            </div>
          );
  }
    
export default MainPage;
