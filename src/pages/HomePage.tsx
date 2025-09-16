
import {useContext,useEffect,useState} from 'react';
import style from './pageCss/LoginPage.module.css';
import {getCookie} from '../store/coockie';
import { useNavigate,Outlet } from 'react-router-dom';
import ThemeToggleButton from '../compoents/ThemeToggleButton';
import useModal from '../customHook/useModal';
import { simpleUserInfo } from '../store/types';
import { AxiosError } from 'axios';
import {useQuery} from 'react-query';
import Services from '../store/ApiService';
import AwakeServer from '../compoents/AwakeServer';

function HomePage() {
    const { openModal } = useModal();
    const { UserService,SocialService } = Services;
    const navigate = useNavigate();
    
    const openFirstModal = () => {
        console.log('sfeesfsef');
        openModal({ type:'username', props: { isPotal:false,isForce:true } });
      };
      const opensecondModal = () => {
        openModal({ type: 'second',props: { isPotal:false}});
      };

      // const { data: userProfile, isLoading, isError,refetch:userProfileRefetch } = useQuery<simpleUserInfo, AxiosError<{ message: string }>>(
      //   'userProfile', // 쿼리 키: 캐싱할 때 사용할 고유 식별자
      //   () => UserService.getUserProfile(), // 데이터를 가져오는 함수
      //   {
      //     staleTime: Infinity,
      //     onSuccess: (data) => {
      //       navigate('/main')
      //     },
      //     onError: (error: AxiosError) => {
      //       console.log(error, '에러 콘솔');
      //       alert(error.response?.data || 'User Profile Data 실패');
      //     },
      //   }
      // );

      const checkLogin = async() => {
        const refreshToken = getCookie('refreshToken'); 
          
        if(!refreshToken || refreshToken === 'expiredToken'){
            openModal({ type: 'sessionExpired', props: { isForce: true } });
            return;
          }else{
            navigate('/main')
          }
       }

       useEffect(()=>{
        checkLogin();
       },[])


    return(
        <div className="flex flex-col h-lvh">
  <ThemeToggleButton></ThemeToggleButton>



        <div className="w-full h-full flex  items-center justify-center px
        -10">
          <section className=" flex items-center justify-center h-full w-112 p-10 relative shadow-none">

   
              <div className='relative w-108 h-100'>
                  <div className='z-0 flex items-center justify-center w-104 h-100 absolute'>
                          <img className="z-10 w-full h-full absolute" src='./monitor.png'></img>
                          {/* <img className="top-4 w-54 h-90 absolute" src='./feedImage.png'></img> */}
                      </div>


                  <div className='bottom-0 right-0  flex items-center justify-center w-32 h-64 absolute'>
                      <img className=" w-full h-full absolute" src='./iphone.png'></img>
                      <img className=" top-2.5 w-28 h-59 absolute" src='./feedImage.png'></img>
                  </div>
              </div>
          </section> 
        <Outlet/>
        </div>
        <div className='w-full flex absolute items-center bottom-0 justify-center p-14'>
              <AwakeServer/>
            </div>
      </div>
    )
    }
    
    
export default HomePage;