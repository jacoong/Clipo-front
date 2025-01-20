
import {useContext,useEffect,useState} from 'react';
import MobileLogin from '../../../compoents/MobileLogin';

function EmailAuthentication() {
//   const todoCtx = useContext(TodosContext);
//   const navigate = useNavigate();
//   const { eventId } = useParams();



//   const [loginValue,setLoginValue] = useState<string>('login')
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
            // setLoginValue(value)
            return
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
                <section className="flex flex-col items-center justify-center w-96 bg-white p-10 rounded-md shadow-none">
                <div className="py-5 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">이메일 인증 코드를 입력해 주십시오.</h1>
                </div>
                <div className="bg-white py-5 px-10 rounded-md shadow-none w-96">
                  <MobileLogin changeToRegister={changeToRegister} requestType={'emailResponse'} />
                </div>
              </section>
    )
    }
    
    
export default EmailAuthentication;