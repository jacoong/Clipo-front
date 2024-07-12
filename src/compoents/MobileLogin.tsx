// import {TodosContext} from '../../store/todo_context'
import {useContext,useEffect,useState,useRef} from 'react';
import { useNavigate,useLocation } from 'react-router-dom'; // If yo
import style from '../compoents/compoentsCss/MobileLogin.module.css';
import {useSendIdPwInfo} from '../customHook/userSendIdPwInfo'
import Button from './Button';
import {emailValidator,passwordValidator,prepasswordValidator,confirmPasswordValidator,encodedCheckCodeValidator} from '../store/validator'
// import FlashMessage from '../compoentItem/FlashMessage';
// import axios from 'axios';
// import { refreshAxios, instance,addResponseInterceptor,addAccessTokenInterceptor,addAccessResponseIntoCookie } from '../../store/axios_context';
// import { TypeOfLoginValue } from '../compoentItem/FlexBox';
// import {setCookie,getCookie,removeCookie} from '../../store/coockie'
// import cookie from 'react-cookies';

type LoginPropsType = {
  nextPopUpPage?:()=>void;
  requestType:string;
//   savedUserLoginInfo?: (setEmailPasswordValue:TypeOfLoginValue)=> void;
//   valueOfUserLoginInfo?:TypeOfLoginValue;
  changeToRegister: (type:string)=> void;
}





type RequestTypeOnly = LoginPropsType['requestType'];

function MobileLogin({nextPopUpPage,requestType,changeToRegister}:LoginPropsType) {
        // const todoCtx = useContext(TodosContext);
 
        interface typeVaildation {
          touched: boolean,
          error: boolean, 
          message: string
        }


        // const savedencodedCheckCode:any = localStorage.getItem('userDataKey');
        // localStorage.clear();
        // localStorage.setItem('userDataKey', );
        // const passwordRef = useRef<HTMLInputElement>(null);
        // const emailRef = useRef<HTMLInputElement>(null);
        const passwordConfirmRef = useRef<HTMLInputElement>(null)
        const prepasswordRef = useRef<HTMLInputElement>(null);
        const encodedCheckCodeRef = useRef<HTMLInputElement>(null);
        const location = useLocation();

        const [emailValidate,setEmailValidate] = useState<typeVaildation>({touched: false, error: false, message: ''})
        const [prepasswordValidate,setPrepasswordValidate] = useState<typeVaildation>({touched: false, error: false, message: ''})
        const [passwordValidate,setPasswordValidate] = useState<typeVaildation>({touched: false, error: false, message: ''})
        const [passwordConfirmValidate,setPasswordConfirmValidate] = useState<typeVaildation>({touched: false, error: false, message: ''})
        const [encodedCheckCodeValidate,setEncodedCheckCodeValidate] = useState<typeVaildation>({touched: false, error: false, message: ''})
        const [isShowPassword,setIsShowPassword] = useState<boolean>(false)
        // const [isShowPassword,setIsShowPassword] = useState<boolean>(false)
        // const [isLoadingConfirm,setIsLoadingConfirm] = useState(false);
        
        const navigate = useNavigate();

        const {passwordRef,emailRef} = useSendIdPwInfo();


        // useEffect(() => {
        //     // If there's an error message, navigate to the error page
        //     if (todoCtx.ErrorMsg) {
        //         navigate('/error',{ state:todoCtx.ErrorMsg }); // If you're using React Router v6, use 'navigate("/error")'
        //     }
        //   }, [todoCtx.ErrorMsg,navigate]); 


          const handleEmail = async(e:React.ChangeEvent<HTMLInputElement>) =>{
            const emailRefValue = emailRef.current!.value;

            if (requestType === 'register') {
              setEmailValidate(await emailValidator(emailRefValue));  //register should add after
            } else {
              setEmailValidate(await emailValidator(emailRefValue));
            }

            return
          }

          const handlePassword = (e:React.ChangeEvent<HTMLInputElement>) =>{
            const passwordRefValue = passwordRef.current!.value;
            const result = passwordValidator(passwordRefValue);
            setPasswordValidate(result)
          }

          const handleprePassword = (e:React.ChangeEvent<HTMLInputElement>) =>{
            const passwordRefValue = prepasswordRef.current!.value;
            const result = prepasswordValidator(passwordRefValue);
            setPrepasswordValidate(result)
          }

          const handlePasswordConfirm = (e:React.ChangeEvent<HTMLInputElement>) =>{
            const passwordRefValue = passwordRef.current!.value;
            const passwordConfirmRefValue = passwordConfirmRef.current!.value;
            const result = confirmPasswordValidator(passwordRefValue,passwordConfirmRefValue);
            setPasswordConfirmValidate(result)
          }

          const handleEncodedCheckCode = (e:React.ChangeEvent<HTMLInputElement>) =>{
            const encodedCheckCode = encodedCheckCodeRef.current!.value;
            const limitedEncodedCheckCode = limitNumberDigit(encodedCheckCode, 4); // 최대 길이를 4로 제한합니다.
            encodedCheckCodeRef.current!.value = limitedEncodedCheckCode; // 입력 필드의 값을 업데이트합니다.
            const result = encodedCheckCodeValidator(limitedEncodedCheckCode); // 제한된 값으로 유효성 검사를 수행합니다.
            setEncodedCheckCodeValidate(result)
          }


            const limitNumberDigit = (el: string, maxlength: number): string => {
              console.log('sefsef')
              if (el.length > maxlength) {
                return el.substring(0, maxlength);
              }
              return el; // 최대 길이를 초과하지 않으면 원래의 문자열을 반환합니다.
            }

          const handleOnclick = (result:string) =>{
            if(result){
              setEmailValidate({touched: false, error: false, message: ''})
              setPasswordValidate({touched: false, error: false, message: ''})
              emailRef.current!.value  = "";
              passwordRef.current!.value  = "";
            }
          }


        const handleSubmit = (e:React.FormEvent<HTMLFormElement>,requestType: RequestTypeOnly) => {
          e.preventDefault();
          // let emailRefValue = null
          if(requestType === 'recreatePassword'){
            
            // setIsLoadingConfirm(true);  // loading activated

            const emailValue = emailRef.current!.value;
            
            // instance.post(`${todoCtx.serverUrl}/api/auth/recreatePassword/${emailValue}`,
            //  )
            //   .then(res => {
            //     if(res.status===200){
            //       alert('recreatePassword done')
            //       // setIsLoadingConfirm(false); // loading disactivated
            //               nextPopUpPage!();
            //     }
            // })
            // .catch(error => {
            //   console.log(`post response: test${emailValue}`, error);
            //   // nextPopUpPage();
            // });
          }
          
          else if(requestType === 'login'){
            const emailValue = emailRef.current!.value;
            const passwordValue = passwordRef.current?.value;
            console.log(passwordValue,'passwordValue');
            if(passwordValue){
                LoginLogic(emailValue,passwordValue)
            }else{
                setIsShowPassword(true)
            }
          }

          else if(requestType === 'register'){
            const emailValue = emailRef.current!.value;
            const passwordValue = passwordRef.current?.value;

            if(passwordValue){
                // instance.post(`${todoCtx.serverUrl}/api/auth/send/check/emailCode/${emailValue}`,
                // {email:emailValue})
                // .then(res => {
                //   if(res.status===200){
                //     const encodedCheckCode:string = res.data.body.encodedCheckCode;
                //     console.log(encodedCheckCode);
                //     if (savedUserLoginInfo) {
                //     savedUserLoginInfo({email:emailValue,password:passwordValue,encodedCheckCode:encodedCheckCode})
               
                //     }else{
                //       throw Error
                //     }
                //     return;
                //     // LoginLogic(emailValue,passwordValue)
                //   }
                // })
                // .catch(error => {
                //   console.log(`post response: test`, error);
                // });
            }else{
                setIsShowPassword(true)
            }
        
          }

          else if(requestType === 'updatePassword'){
            const prepassword = prepasswordRef.current!.value;
            const passwordValue = passwordRef.current!.value;
            // instance.patch(`${todoCtx.serverUrl}/api/update/password`,
            // {oldPassword:prepassword,newPassword:passwordValue})
            // .then(res => {
            //   if(res.status===200){
            //     alert('poassword  change done')

            //   }
            // })
            // .catch(error => {
            //   console.log(`post response: test`, error);
            // });
          }

          // else if(requestType === 'encodedCheckCode'){
          //   console.log(valueOfUserLoginInfo,'??')
          //   if(valueOfUserLoginInfo){
            // const encodedCheckCode = encodedCheckCodeRef.current!.value;
            // instance.post(`${todoCtx.serverUrl}/api/auth/check/email`,
            // {encodedCheckCode:valueOfUserLoginInfo.encodedCheckCode,checkCode:encodedCheckCode})
            // .then(res => {
            //   if(res.status===200){
            //     alert('validate done')
            //     RegisterLogic(valueOfUserLoginInfo.email,valueOfUserLoginInfo.password)
            //   }
            // })
            // .catch(error => {
            //   console.log(`post response: test`, error);
            // });}else{
            //   throw Error
            }
  





  
      // const addAccessTokenInterceptor = (accessToken: string) => {
      //   console.log('인터셉터')
      //   instance.interceptors.request.use(
      //     (config) => {
      //       config.headers.Authorization = `Bearer ${accessToken}`;
      //       return config;
      //     },
      //     (error) => {
      //       return Promise.reject(error);
      //     }
      //   );
      // };

      // const addResponseInterceptor = () => {
      //   instance.interceptors.response.use(
      //     (response) => {
      //       return response;
      //     },
      //     async (error) => {
      //       if (error.response.status === 401) {
      //       removeCookie('accessToken');
      //       console.log('ㅈㅈㅈㅈ')
      //       const originalRequest = error.config;
   
      //         console.log('ㅌㅌㅌㅌㅌㅌㅌ')
      //           await fetchNewAccessToken(originalRequest);
      //           return axios(originalRequest);

      //     }
      //     else{
      //         console.error(error)
      //     }
      //   }
      //   );
      // };
      



      // const fetchNewAccessToken = async (originalRequest:any) => {
      //   console.log('fetchNewAccessToken111');


      //     const refreshToken = getCookie('refreshToken')
      //     console.log(refreshToken)
      //     if(refreshToken){
      //       const res = await axios.post(`${todoCtx.serverUrl}/api/auth/recreate/accessToken`,{}, {
      //         headers:{
      //           Authorization:`Bearer ${refreshToken}`,
      //           withCredentials: true
      //         }
      //     })
      //     if (res.status === 200) {
      //       console.log('fetcsqsqken')
      //       const accessToken = res.data.body.replace("Bearer ", "");;  // should change depend on adress
      //       console.log(accessToken,'ㄴㄷㄹㄷㄴㄹㄴㄷㄹㄴㄷㄹㄴㄷ')
      //       const validateTime = 'sefescds';  // should change depend on adress
      //       addAccessTokenInterceptor(accessToken);
      //       addResponseInterceptor();
      //       addAccessResponseIntoCookie({accessToken,refreshToken,validateTime});
      //       return axios(originalRequest);
      //     }
      //     else if(res.status === 301){
      //       removeCookie('refreshToken');
      //       const currentURL = location.pathname;
      //       todoCtx.unAuthenticateUser(currentURL);
      //     }
      //   else{
      //     throw { code: 500, message: 'Unexpected Message' };
      //   }
      //   }
      //   };




      const LoginLogic = (emailValue:string,passwordValue:string)=>{
        console.log('LoginLogic worked')
        // instance.post(`${todoCtx.serverUrl}/api/auth/login`,
        // {email:emailValue,password:passwordValue})
        // .then(res => {
        //   if(res.status===200){
        //     // const getReferer = window.location.hostname;
        //     // instance.defaults.headers.common['Refererss'] = '43.202.57.92';
        //     const accessToken = res.data.body.accessToken.replace("Bearer ", "");  // should change depend on adress
        //     const refreshToken = res.data.body.refreshToken.replace("Bearer ", "");  // should change depend on adress
        //     const validateTime = res.data.body.validateTime;  // should change depend on adress
        //     console.log('같아야지',accessToken,'ㅇㅇ',refreshToken)
        //     addAccessResponseIntoCookie({accessToken,refreshToken,validateTime});
        //     // addAccessTokenInterceptor(accessToken);
        //     // addResponseInterceptor();


        //     const previousUrl = localStorage.getItem('previousUrl');
        //     if(previousUrl){
        //       navigate(previousUrl);
        //       localStorage.removeItem('previousUrl');
        //     }else{
        //       console.log('??')
        //       // navigate('/invite/fse');
              
        //     }
        //   }
        // })


        // .catch(error => {
        //   console.log(`post response: test`, error);
        // });
      }

    //   const RegisterLogic = (emailValue:string,passwordValue:string)=>{
    //     instance.post(`${todoCtx.serverUrl}/api/auth/signUp`,
    //         {email:emailValue,password:passwordValue})
    //         .then(res => {
    //           if(res.status===200){
    //             alert('signup done')
    //             LoginLogic(emailValue,passwordValue)
    //           }
    //         })
    //         .catch(error => {
    //           console.log(`post response: test`, error);
    //         });
    //   }



      const handleFormChange = (value:string) =>{
        // setIsShowPassword(false);
        // changeToRegister(value);
      }

          return (
              <div className={style.loginbox}>



                  {requestType ===  'recreatePassword'? 
                        
                  <form onSubmit={(e) =>{handleSubmit(e,'recreatePassword')}}>
                    <div className={`${style.userbox}
                      ${emailValidate.touched
                        ? (emailValidate.error ? style.error : style.success)
                        : style.initial}`
                      }
                    >
                      <input onChange={handleEmail} ref={emailRef} type="text" id='email' name="" required={true} />
                      <label htmlFor="email">Email</label>
                      <div className={style.userbox__vaildateMsg}>
                        <p>{emailValidate.message}</p>
                      </div>
                    </div>

                    {emailValidate.touched && !emailValidate.error
                      ? <Button width={'large'} type="submit">Send</Button>
                      : <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                    }
              

                    {/* <FlashMessage handleOnclick={handleOnclick} /> */}
                  </form>
                  :
                  (requestType ==='updatePassword' ? 


                  <form  onSubmit={(e) => handleSubmit(e,'updatePassword')}>
                  <div className={`${style.userbox}
                      
                                    ${prepasswordValidate.touched
                                        ? (prepasswordValidate.error ? style.error : style.success)
                                        : style.initial}`
                                    }
                  >
                    <input  onChange={handleprePassword}  ref={prepasswordRef} type="prepassword" id="prepassword" name="prepassword"required={true}/>
                    <label htmlFor="prepassword" >Previous Password</label>
                    
                    <div style={{marginBottom:'0px'}} className={style.userbox__vaildateMsg}>
                    <p>{prepasswordValidate.message}</p>
                    </div>
                  </div>
            
                  <div className={`${style.userbox}
                        
                        ${passwordValidate.touched
                            ? (passwordValidate.error ? style.error : style.success)
                            : style.initial}`
                        }
                    >
                      <input  onChange={handlePassword}  ref={passwordRef} type="password" id="password" name="password"required={true}/>
                      <label htmlFor="password" >Password</label>
                      
                      <div style={{marginBottom:'0px'}} className={style.userbox__vaildateMsg}>
                      <p>{passwordValidate.message}</p>
                      </div>
                    </div>

                  <div className={`${style.userbox}
                      
                  ${passwordConfirmValidate.touched
                    ? (passwordConfirmValidate.error ? style.error : style.success)
                    : style.initial}`
                                }
              >
                <input  onChange={handlePasswordConfirm} ref={passwordConfirmRef} type="password" id="passwordConfirm" name=""required={true}/>
                <label htmlFor="passwordConfirm" >New Password Confirm</label>
                
                <div className={style.userbox__vaildateMsg}>
                <p>{passwordConfirmValidate.message}</p>
                </div>
              </div>




                  {passwordValidate.touched && !passwordValidate.error && prepasswordValidate.touched && !prepasswordValidate.error
                          ? <Button width={'large'} type="submit">Send</Button>
                          : <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button>}
      


                  {/* <FlashMessage handleOnclick={handleOnclick}/> */}
                  {/* <Button width={'large'}type="submit">Send</Button>
                  <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button> */}
                  </form>
                  :

                  (requestType ==='encodedCheckCode' ? 

                  <form  onSubmit={(e) => handleSubmit(e,'encodedCheckCode')}>
                  <div className={`${style.userbox}
                      
                                    ${encodedCheckCodeValidate.touched
                                        ? (encodedCheckCodeValidate.error ? style.error : style.success)
                                        : style.initial}`
                                    }
                  >
                    <input type='text' onChange={handleEncodedCheckCode}  ref={encodedCheckCodeRef}  id="encodedCheckCode" name="encodedCheckCode"required={true}
                    />
                    <label htmlFor="encodedCheckCode" >Vaildate Code</label>
                    
                    <div style={{marginBottom:'0px'}} className={style.userbox__vaildateMsg}>
                    <p>{encodedCheckCodeValidate.message}</p>
                    </div>
                  </div>


                  {encodedCheckCodeValidate.touched && !encodedCheckCodeValidate.error
                          ? <Button width={'large'} type="submit">Send</Button>
                          : <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button>}
      


                  {/* <FlashMessage handleOnclick={handleOnclick}/> */}
                  {/* <Button width={'large'}type="submit">Send</Button>
                  <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button> */}
                  </form>

                  :

                  (requestType ==='login' ? 

                  <form  onSubmit={(e) => handleSubmit(e,'login')}>
                 <div className={`${style.userbox}
                        
                        ${emailValidate.touched
                            ? (emailValidate.error ? style.error : style.success)
                            : style.initial}`
                        }
                      >
        <input onChange={handleEmail} ref={emailRef}  type="text" id='email' name="email"  required={true}/>
        <label htmlFor="email" >Email</label>
        
        <div className={style.userbox__vaildateMsg}>
        <p>{emailValidate.message}</p>
        </div>
                </div>


      {
          isShowPassword?
          <>
          <div className={`${style.userbox}
          
          ${passwordValidate.touched
              ? (passwordValidate.error ? style.error : style.success)
              : style.initial}`
          }
>
<input  onChange={handlePassword}  ref={passwordRef} type="password" id="password" name="password"required={true}/>
<label htmlFor="password" >Password</label>

<div style={{marginBottom:'0px'}} className={style.userbox__vaildateMsg}>
<p>{passwordValidate.message}</p>
</div>
          </div>
          <div className={style.recreatePassword__container}>
          <p className={style.recreatePassword__container__p} onClick={nextPopUpPage}>
              Forget Password?
          </p>
          </div>
          </>
            :
            null
         }


{!isShowPassword?

emailValidate.touched && !emailValidate.error
    ? <Button width={'large'} type="submit">Send</Button>
    : <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button>
:
passwordValidate.touched && !passwordValidate.error && emailValidate.touched && !emailValidate.error
    ? <Button width={'large'} type="submit">Send</Button>
    : <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button>
} 
      


                  {/* <FlashMessage handleOnclick={handleOnclick}/> */}
                  {/* <Button width={'large'}type="submit">Send</Button>
                  <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button> */}
                    <div className={style.register__container}>
                      <p className={style.register__container__p}>Don't have account?</p>
                      <p className={style.register__container__join_p} onClick={() => handleFormChange('register')}>Join</p>
                    
                    </div>
                  </form>
                  :


                  (requestType ==='register' ?
                  <form  onSubmit={(e) => handleSubmit(e,'register')}>
                  

                    <div className={`${style.userbox}
                        
                                      ${emailValidate.touched
                                          ? (emailValidate.error ? style.error : style.success)
                                          : style.initial}`
                                      }
                    >
                      <input onChange={handleEmail} ref={emailRef}  type="text" id='email' name="email"  required={true}/>
                      <label htmlFor="email" >Email</label>
                      
                      <div className={style.userbox__vaildateMsg}>
                      <p>{emailValidate.message}</p>
                      </div>
                    
                    </div>


                    {
                        isShowPassword?
                        <>
                        <div className={`${style.userbox}
                        
                        ${passwordValidate.touched
                            ? (passwordValidate.error ? style.error : style.success)
                            : style.initial}`
                        }
      >
        <input  onChange={handlePassword}  ref={passwordRef} type="password" id="password" name="password"required={true}/>
        <label htmlFor="password" >Password</label>
        
        <div style={{marginBottom:'0px'}} className={style.userbox__vaildateMsg}>
        <p>{passwordValidate.message}</p>
        </div>
                        </div>
                          <div
                          className={`${style.userbox}
                          ${passwordConfirmValidate.touched
                              ? passwordConfirmValidate.error ? style.error : style.success
                              : style.initial}`
                          }
                      >
                          <input
                          onChange={handlePasswordConfirm}
                          ref={passwordConfirmRef}
                          type="password"
                          id="passwordConfirm"
                          required
                          />
                          <label htmlFor="passwordConfirm">Password Confirm</label>
                          <div className={style.userbox__validateMsg}>
                          <p>{passwordConfirmValidate.message}</p>
                          </div>
                      </div>
                      </>
                    :
                    null
                    }




                {!isShowPassword?

                emailValidate.touched && !emailValidate.error
                    ? <Button width={'large'} type="submit">Send</Button>
                    : <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                :
                passwordConfirmValidate.touched && !passwordConfirmValidate.error && passwordValidate.touched && !passwordValidate.error && emailValidate.touched && !emailValidate.error
                    ? <Button width={'large'} type="submit">Send</Button>
                    : <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                }  

        


                    {/* <FlashMessage handleOnclick={handleOnclick}/> */}
                    <div className={style.register__container}>
                      <p className={style.register__container__p}>Don't have account?</p>
                      <p className={style.register__container__join_p} onClick={() => handleFormChange('login')}>Join</p>
                    
                    </div>
                    {/* <Button width={'large'}type="submit">Send</Button>
                    <Button width={'large'} Background_color={'b-gary'} disabled={true} type="submit">Send</Button> */}
                  </form>
                  :
                  null
                )
                  )
                  )
                    )
                  }

            </div>
        );
       };
      
    
export default MobileLogin;