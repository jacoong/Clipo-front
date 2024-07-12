
import {useContext,useEffect,useState} from 'react';
// import {TodosContext} from '../../store/todo_context'
// import {instance} from '../../store/axios_context'
import style from './pageCss/LoginPage.module.css';
// import FlexBox,{TypeOfLoginValue} from '../compoentItem/FlexBox'
// import JoinForm from '../compoentItem/JoinForm';
// import {getCookie} from '../../store/coockie'
import { useNavigate,useParams } from 'react-router-dom';
import MobileLogin from '../compoents/MobileLogin';
import SocialGoogle from '../compoents/SocialLogin/SocialGoogle';
import SocialKakao from '../compoents/SocialLogin/SocialKakao';
import SocialNaver from '../compoents/SocialLogin/SocialNaver';

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
        if(value === 'register'){
            setLoginValue(value)
        }else{
            setLoginValue(value)
        }
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
      <div className={style.page_wrapper}>
        <div className={style.page_wrapper__header}>

                      <div className={style.page_wrapper__header__container}>
                          <img alt={'dd'} src={process.env.PUBLIC_URL + '/img/Logo.png'}></img>
                      </div>
                    </div>


                    <div className={style.page_wrapper__main}>
                        <section className={style.page_wrapper__main__wrapper}>
                            <div className={style.page_wrapper__main__wrapper__title}>
                                {loginValue === 'login'?
                                <h1>다시 오신 걸 환영합니다</h1>
                                :
                                <h1>새로운 계정을 등록하세요</h1>
                            }
                
                            </div>
                            <div className={style.page_wrapper__main__wrapper__login}>
                                <MobileLogin changeToRegister={changeToRegister} requestType={loginValue} ></MobileLogin>
                                <div className={style.openMain__flexBox__popUp__body__container__or}>
                                    <div className={style.openMain__flexBox__popUp__body__container__or__line}></div>
    
                                    <div className={style.openMain__flexBox__popUp__body__container__or__text}>
                                    <p>Or</p>
                                    </div>
    
                                    <div className={style.openMain__flexBox__popUp__body__container__or__line}></div>
                                </div>
                                <div className={style.main__right__container__button}>
                                <SocialKakao></SocialKakao>
                                </div>

                                <div className={style.main__right__container__button}>
                                <SocialGoogle></SocialGoogle>
                                </div>

                                <div className={style.main__right__container__button}>
                                <SocialNaver></SocialNaver>
                                </div>
                            </div>
                        </section>
                    </div>
    </div>
    )
    }
    
    
export default LoginPage;