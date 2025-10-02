
import { useEffect } from 'react';
import { getCookie } from '../store/coockie';
import { useNavigate, Outlet } from 'react-router-dom';
import ThemeToggleButton from '../compoents/ThemeToggleButton';
import useModal from '../customHook/useModal';
import Services from '../store/ApiService';
import AwakeServer from '../compoents/AwakeServer';
import useMediaQuery from '../customHook/useMediaQuery';
import { useTheme } from '../customHook/useTheme';
import Aurora from '../compoents/Aurora';

function HomePage() {
    const { openModal } = useModal();
    const { UserService,SocialService } = Services;
    const navigate = useNavigate();
    const { isDark } = useTheme();
    
    // 모바일 감지 (768px 이하)
    const isMobile = useMediaQuery("(max-width: 768px)");
    
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
        if(refreshToken){
          if(refreshToken === 'expiredToken'){
            openModal({ type: 'sessionExpired', props: { isForce: true } });
          }else{
            navigate('/main')
          }
        }else{
          return
        }
       }

       useEffect(()=>{
        checkLogin();
       },[])


    return(
        <div className={`relative min-h-screen overflow-auto ${isDark ? 'bg-[#050505]' : 'bg-slate-50'}`}>
            <div className='relative z-10 w-full h-screen'>
            {isMobile ? (
              <>
           
                <div className='w-full h-full flex flex-col items-center justify-center px-6  gap-6 place-items-center'>
                  <div className=' w-full flex items-center justify-center'>
                    <Outlet/>
                  </div>
                      <div className='relative bottom-4 w-full px-6 flex flex-col items-center justify-between'>
                  <div className=' relative'>
                    <AwakeServer/>
                  </div>
                  <div className='w-full flex justify-end'>
                    <ThemeToggleButton/>
                  </div>
                </div>
                </div>
            
            </>
            ) : (
                // 데스크톱일 때는 기존 레이아웃 표시
                <div className="flex flex-col h-screen items-center overflow-auto">
                  <div className='flex-col flex w-full  flex-1 items-center justify-center px-5 '>
                    <div className='flex-8 flex w-full items-center justify-center gap-14'>
                      <section className="flex flex-1 items-center justify-center w-112 p-10 relative shadow-none">
                          <div className='relative w-64 h-60'>
                              <div className='z-0 w-full h-full flex items-center justify-center'>
                                      <img className="z-10 w-full h-full absolute" src='./logo3.png'></img>
                              </div>
                          </div>
                      </section> 
                      <div className='h-auto flex-1 flex justify-center'>
                        <Outlet/>
                      </div>
                    </div>

                       <div className='flex-2 w-full  flex items-center justify-between '>
                    <div className='opacity-0'>placeholder</div>
                    <div className='inline-block'>
                        <AwakeServer/>
                    </div>
                    <ThemeToggleButton></ThemeToggleButton>
                  </div>


                  </div>
               
              </div>
            )}
            </div>
        </div>
    )
    }
    
    
export default HomePage;
