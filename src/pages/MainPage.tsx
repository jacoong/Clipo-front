import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
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
import {simpleUserInfo} from '../store/types';
import Loading from '../pages/pageModule/Loading';
import { useMutation } from "react-query";
import { useTheme } from "../customHook/useTheme"
import { useSelector, useDispatch } from 'react-redux';
import { pushUserInfo,clearUserInfo } from '../store/loginUserInfoSlice';
import {UserInfo} from '../store/types';
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
        // const [userInfo,setUserInfo] = useState<UserType>()
        const [userInfo,setUserInfo] = useState<UserInfo|null>(null)

        const savedData:any = localStorage.getItem('userDataKey'); 
        const userId = JSON.parse(savedData);
        const { openModal } = useModal();

        const dispatch = useDispatch();
        // const useLoginUserProfile = () => {
        //   return useQuery<simpleUserInfo, AxiosError>(
        //     'simpleUserInfo',
        //     () => UserService.getUserProfile(),
        //     {
        //       onSuccess: (data) => {
        //         console.log('User Profile Data:', data);
        //         isUserLogin(data);
        //         setLoading(false);

        //         // 여기에서 추가 로직을 처리할 수 있습니다.
        //       },
        //       onError: (error) => {
        //         // alert(error.response?.data || 'Error fetching user profile');
        //         return
        //       },
        //       retry: 1,
        //     }
        //   );
        // };

        const getUserInfoMutation = useMutation<simpleUserInfo, AxiosError<{ message: string }>>(UserService.getUserProfile, {
          onSuccess: (data) => {
            console.log('User Profile Data:', data);

            isUserLogin(data);
            setLoading(false);
          },
          onError: (error:AxiosError) => {
            console.log(error,'에러 콘솔')
            alert(error.response?.data ||'User Profile Data 실패');
          }
        });


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

        useEffect(()=>{
          getUserInfoMutation.mutate();
        },[])

  



          return (
            <>
            
                <Loading isLoaded={loading}/>
                <div className={`overflow-auto relative z-10 w-full h-screen flex box-border ${isDark ? 'bg-customBlack' : 'bg-customWhite'}` }>

                  {
                    isShowedMainPage
                    ?
                    <>
                    <div className='fixed h-lvh'>
                    <Menubar userInfo={userInfo}/>
                    </div>
                    <div className='w-full h-lvh sm:w-116 mx-auto'>
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
