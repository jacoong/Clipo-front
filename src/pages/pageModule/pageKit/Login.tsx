
import {useContext,useEffect,useState} from 'react';
// import {TodosContext} from '../../store/todo_context'
// import {instance} from '../../store/axios_context'
import style from './pageCss/LoginPage.module.css';
// import FlexBox,{TypeOfLoginValue} from '../compoentItem/FlexBox'
// import JoinForm from '../compoentItem/JoinForm';
// import {getCookie} from '../../store/coockie'
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../../compoents/LoginForm';
import { useTheme } from '../../../customHook/useTheme';
import JoinAsAdmin from '../../../compoents/SocialLogin/JoinAsAdmin';
import useMediaQuery from '../../../customHook/useMediaQuery';
import Button from '../../../compoents/Button';
import { SiNaver } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { RiKakaoTalkFill } from "react-icons/ri";

function LoginPage() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width: 768px)');
  const [loginValue,setLoginValue] = useState<string>('login')
//   const [emailPasswordValue,setEmailPasswordValue] = useState<TypeOfLoginValue>({email:'',password:'',encodedCheckCode:''})

//       const savedCurrentUrl = () => {
//          console.log(`savedCurrentUrl`);
//         const currentUrl = window.location.href;
//         const pathname = new URL(currentUrl).pathname;
//         localStorage.setItem('previousUrl', pathname + '/isInviterInvolve');
//        }

             
//        const isUserHadToken = () => {
//         const refreshToken = getCookie('refreshToken'); 
//         if(refreshToken){
//             const previousUrl = localStorage.getItem('previousUrl');
//             if (previousUrl) { 
//                 navigate(previousUrl);
//                 localStorage.removeItem('previousUrl');
//             } else {
//                 navigate('/');
//             }
//       }
//     }


//        useEffect(()=>{
//         savedCurrentUrl();
//         isUserHadToken();
//        },[])
      
   







      const changeToRegister = (value:string) =>{
            setLoginValue(value)
        }


//       const savedUserLoginInfo = (userInfo: TypeOfLoginValue) =>{
//         if(userInfo){
//             console.log(userInfo,'why2')
//         setEmailPasswordValue(userInfo);
//         setLoginValue('encodedCheckCode')
//         }else{
//             return
//         }
//       }

    return(

                <section className=" flex flex-col items-center justify-center h-auto w-96 md:m-10 rounded-md shadow-none">
                      {isMobile ? 
                          <img className='w-12 h-12' src='./logo3.png'></img>
                          : null}
                <div className=" pt-3 pb-0 md:py-3 text-center">
                  {loginValue === 'login' ?
                  <div className="space-y-2">
                         <h1 className="text-xl md:text-3xl font-semibold">로그인</h1>
                         <p className="text-sm text-gray-600 font-medium">돌아오신걸 환영합니다</p> 
                  </div>:
                  <div className="space-y-2">
                    <h1 className="text-xl font-semibold">회원가입</h1>
                    <p className="text-sm text-gray-600 font-medium">만나서 반갑습니다</p>
                  </div>
                  }
                </div>
                <div className={`py-1 ${isMobile ? 'px-10 w-full' : 'px-10 w-96'} rounded-md shadow-none`}>
                  <LoginForm isDark={isDark} changeToRegister={changeToRegister} requestType={loginValue} />
                </div>
                <div className="flex flex-col space-y-4 items-center" id='second'>
                    <JoinAsAdmin />
                    <div className="w-52  flex items-center gap-3 text-gray-400 text-sm font-medium">
                      <div className="flex-1 h-px bg-gray-300" />
                      <span>또는</span>
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>
                    <div
                      className='flex items-center justify-center w-[300px] h-[48px] relative rounded-[24px] cursor-pointer overflow-hidden animate-pulse-scale hover:shadow-[0_0_20px_#999290] transition-shadow duration-300'
                      onClick={() => navigate('/socialLoginPage')}
                    >
                      <div className='w-full h-full grid grid-cols-3 text-sm font-semibold'>
                        <div className='flex items-center justify-center bg-white'><FcGoogle className='text-xl'/></div>
                        <div className='flex items-center justify-center bg-[#FAE100]'><RiKakaoTalkFill className='text-lg text-black'/></div>
                        <div className='flex items-center justify-center bg-[#04C759]'><SiNaver className='text-sm'/></div>
                      </div>
                    </div>


                  </div>
              </section>
              //   <section className="flex flex-col items-center justify-center w-96 bg-white p-10 rounded-md shadow-none">
              //   <div className="py-5 text-center">
              //     {loginValue === 'login' ?
              //       <h1 className="text-2xl font-semibold text-gray-800">다시 오신 걸 환영합니다</h1> :
              //       <h1 className="text-2xl font-semibold text-gray-800">새로운 계정을 등록하세요</h1>
              //     }
              //   </div>
              //   <div className="bg-white py-5 px-10 rounded-md shadow-none w-96">
              //     <MobileLogin changeToRegister={changeToRegister} requestType={loginValue} />
              //     <div className="flex items-center justify-around mt-5 mb-4">
              //       <div className="w-28 h-px bg-gray-200"></div>
              //       <div className="text-gray-600">Or</div>
              //       <div className="w-28 h-px bg-gray-200"></div>
              //     </div>
              //     <div className="space-y-2">
              //       <SocialKakao />
              //       <SocialGoogle />
              //       <SocialNaver />
              //     </div>
              //   </div>
              // </section>
    )
    }
    
    
export default LoginPage;
