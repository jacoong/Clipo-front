
import {useContext,useEffect,useState} from 'react';
// import {TodosContext} from '../../store/todo_context'
// import {instance} from '../../store/axios_context'
import style from './pageCss/LoginPage.module.css';
// import FlexBox,{TypeOfLoginValue} from '../compoentItem/FlexBox'
// import JoinForm from '../compoentItem/JoinForm';
// import {getCookie} from '../../store/coockie'
import { useNavigate,useParams } from 'react-router-dom';
import LoginForm from '../../../compoents/LoginForm';
import SocialGoogle from '../../../compoents/SocialLogin/SocialGoogle';
import SocialKakao from '../../../compoents/SocialLogin/SocialKakao';
import SocialNaver from '../../../compoents/SocialLogin/SocialNaver';

function LoginPage() {
//   const todoCtx = useContext(TodosContext);
//   const navigate = useNavigate();
//   const { eventId } = useParams();



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

                <section className=" flex flex-col items-center justify-center w-96 p-10 rounded-md shadow-none">
                <div className="py-5 text-center">
                  {loginValue === 'login' ?
                    <h1 className="text-2xl font-semibold">돌아오신걸 환영합니다</h1> :
                    <h1 className="text-2xl font-semibold">만나서 반갑습니다</h1>
                  }
                </div>
                <div className="py-5 px-10 rounded-md shadow-none w-96">
                  <LoginForm changeToRegister={changeToRegister} requestType={loginValue} />
                </div>
                <div className="space-y-2" id='second'>
                    <SocialGoogle />
                    <SocialKakao />
                    <SocialNaver />
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