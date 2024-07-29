// import {TodosContext} from '../../store/todo_context'
import {useContext,useEffect,useState,useRef} from 'react';
import Loading from './Loading';
import CustomValidaterInput from './CustomValidaterInput';
import { useNavigate,useLocation,Link } from 'react-router-dom'; // If yo
import style from '../compoents/compoentsCss/MobileLogin.module.css';
import PhoneInput from '../compoents/PhoneInput';
import Button from './Button';
import UserService from '../store/UserService'
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import { LoginType,SMS,SMSValidate,LogInServerResponse } from '../store/types';
import { LoginLogic } from '../store/axios_context';
// import FlashMessage from '../compoentItem/FlashMessage';
// import axios from 'axios';
// import { refreshAxios, instance,addResponseInterceptor,addAccessTokenInterceptor,addAccessResponseIntoCookie } from '../../store/axios_context';
// import { TypeOfLoginValue } from '../compoentItem/FlexBox';
// import {setCookie,getCookie,removeCookie} from '../../store/coockie'
// import cookie from 'react-cookies';

type LoginPropsType = {
  nextPopUpPage?:()=>void;
  requestType:string;
  userInfo?:any;
//   savedUserLoginInfo?: (setEmailPasswordValue:TypeOfLoginValue)=> void;
//   valueOfUserLoginInfo?:TypeOfLoginValue;
  changeToRegister: (type:string)=> void;
}





type RequestTypeOnly = LoginPropsType['requestType'];

function MobileLogin({userInfo,nextPopUpPage,requestType,changeToRegister}:LoginPropsType) {
        // const todoCtx = useContext(TodosContext);

        interface typeVaildation {
          touched: boolean,
          error: boolean, 
          message: string,
          value:string
        }
 
        const location = useLocation(); 
        const [emailValidate,setEmailValidate] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
        const [newPasswordValidate,setNewPasswordValidate] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
        const [passwordValidate,setPasswordValidate] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
        const [passwordConfirmValidate,setPasswordConfirmValidate] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
        const [encodedCheckCodeValidate,setEncodedCheckCodeValidate] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
        const [smsEncodedCheckCodeValidate,setSmsEncodedCheckCodeValidate] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
        const [emailEncodedCheckCodeValidate,setEmailSmsEncodedCheckCodeValidate] = useState<typeVaildation>({touched: false, error: false, message: '',value:''})
        const [isValidPhoneInput,setIsValidPhoneInput] = useState<typeVaildation>({touched: false, error: false, message: '',value:''});


        const [isShowPassword,setIsShowPassword] = useState<boolean>(false)
        const [isLoading,setIsLoading] = useState<boolean>(false);
        const [phone, setPhone] = useState('');
        // const [isShowPassword,setIsShowPassword] = useState<boolean>(false)
        // const [isLoadingConfirm,setIsLoadingConfirm] = useState(false);
        
        const navigate = useNavigate();



        const loginMutation = useMutation<LogInServerResponse, AxiosError<{ message: string }>, LoginType>(UserService.login, {
          onSuccess: (data) => {
            console.log('mutation data')
            const accessToken = data.body.accessToken.replace("Bearer ", "");  // should change depend on adress
            const refreshToken = data.body.refreshToken.replace("Bearer ", "");  // should change depend on adress
            const validateTime = data.body.validateTime;  // should change depend on adress
            LoginLogic({accessToken,refreshToken,validateTime})
        },
        onError: (error:AxiosError) => {
          alert(error.response?.data || '로그인 실패');
        }
        });
        

        const signUpMutation = useMutation<void, AxiosError<{ message: string }>, LoginType>(UserService.signUp, {
          onSuccess: () => {
            navigate('/sms/request',{ state: {email:emailValidate.value}});
          },
          onError: (error:AxiosError) => {
            alert(error.response?.data ||'회원가입 실패');
          }
        });
        
        const smsRequestMutation = useMutation<void, AxiosError<{ message: string }>, SMS>(UserService.smsRequest, {
          onSuccess: () => {
            navigate('/sms/authentication',{ state: {email:userInfo.email, phone:isValidPhoneInput.value}});
          },
          onError: (error:AxiosError) => {
            alert(error.response?.data || 'SMS 요청 실패');
          }
        });

        const forgetPasswordMutation = useMutation<void, AxiosError<{ message: string }>, any>(UserService.forgetPassword, {
          onSuccess: () => {
            navigate('/confirm/password/changed');
          },
          onError: (error:AxiosError) => {
            alert(error.response?.data || 'SMS 요청 실패');
          }
        });
        
        const smsVerificationMutation = useMutation<void, AxiosError<{ message: string }>,SMSValidate>(UserService.smsVerificate, {
          onSuccess: () => {
            alert('SMS 인증 성공');
          },
          onError: (error:AxiosError) => {
            alert(error.response?.data || 'SMS 인증 실패');
          }
        });
        
        const updatePasswordMutation = useMutation(UserService.updatePassword, {
          onSuccess: () => {
            alert('비밀번호 수정 완료');
          },
          onError: (error:AxiosError) => {
            alert(error.response?.data || '비밀번호 수정 실패');
          }
        });



          const passwordValueInit = () =>{
              setPasswordValidate({touched: false, error: false, message: '',value:''})
          }
        // const handleSubmit = async(e:React.FormEvent<HTMLFormElement>,requestType: RequestTypeOnly) => {
        //   e.preventDefault();
        //   // let emailRefValue = null
        //   if(requestType === 'SmsRequest'){
        //     const smsNumber = isValidPhoneInput.value;
        //     const requestBody = {phone:smsNumber}
        //     smsRequest(requestBody)
        //     if(smsRequestResponse){
        //       navigate('sms/authentication')
        //     }else{
        //     alert(registerError)
        //   }
        //   } 
        //   else if(requestType === 'smsVerification'){
        //     const smsVerificationCode = smsEncodedCheckCodeValidate.value;
        //     const requestBody = {validateSMSCode:smsVerificationCode}
        //     smsValidateRequest(requestBody)
        //     if(smsValidateResponse){
        //       return smsValidateResponse
        //     }else{
        //     alert(registerError)
        //   }
        //   } 
        //   else if(requestType === 'login'){
        //     const emailValue = emailValidate.value;
        //     const passwordValue = passwordValidate.value;
        //     const requestBody = {email:emailValue,password:passwordValue}
        //     if(passwordValue){
        //         loginRequest(requestBody);
        //         if(loginResponse){
        //           navigate('/main')
        //       }else{
        //         alert(registerError)
        //       }
        //     }else{
        //         setIsShowPassword(true)
        //     }
        //   }
        //   else if(requestType === 'register'){
        //     const emailValue = emailValidate.value;
        //     const passwordValue = passwordValidate.value;
        //     const requestBody = {email:emailValue,password:passwordValue}
        //     if(passwordValue){
        //       await registerRequest(requestBody);
        //       if(registerResponse){ 
        //           navigate('sms/request')
        //       }else{
        //         alert(registerError) 
        //       }
        //     }else{
        //         setIsShowPassword(true)
        //     }
        //   }
        //   else if(requestType === 'updatePassword'){
        //     const prepassword = passwordValidate.value;
        //     const newPasswordValue = newPasswordValidate.value;
        //     const requestBody = {newPassword:newPasswordValue,oldPassword:prepassword}
        //     updatePWRequest(requestBody);
        //       if(updatePWResponse){ 
        //           alert('비밀번호 수정 완료')
        //       }else{
        //         alert(registerError)
        //       }
        //   }
        //   passwordValueInit()
        //     }



            



      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, requestType: string) => {
        e.preventDefault();
    
        if (requestType === 'smsRequest') {
          const smsNumber = isValidPhoneInput.value;
          const requestBody = { phone: smsNumber, email:userInfo.email, password:userInfo.password };
          smsRequestMutation.mutate(requestBody);
        } 
       else if (requestType === 'forgetPassword') {
        const smsNumber = isValidPhoneInput.value;  
        forgetPasswordMutation.mutate(smsNumber);
       }
        else if (requestType === 'smsVerification') {
          const smsVerificationCode = smsEncodedCheckCodeValidate.value;
          const requestBody = { validateSMSCode: smsVerificationCode,email:userInfo.email,phone:userInfo.phone };
          smsVerificationMutation.mutate(requestBody);
        } else if (requestType === 'login') {
          const emailValue = emailValidate.value;
          const passwordValue = passwordValidate.value;
          const requestBody = { email: emailValue, password: passwordValue };
          if (passwordValue) {
            loginMutation.mutate(requestBody);
          } else {
            setIsShowPassword(true)
          }
        } else if (requestType === 'register') {
              const emailValue = emailValidate.value;
              const passwordValue = passwordValidate.value;
              const requestBody = {email:emailValue,password:passwordValue}
              if(passwordValue){
                signUpMutation.mutate(requestBody);
                    navigate('sms/request')
              }else{
                  setIsShowPassword(true)
              }
        } else if (requestType === 'updatePassword') {
          const prePassword = passwordValidate.value;
          const newPasswordValue = emailValidate.value; // Assuming you're getting new password from emailValidate, adjust if needed
          const requestBody = { newPassword: newPasswordValue, oldPassword: prePassword };
          updatePasswordMutation.mutate(requestBody);
        }
      };
            


    const sendValidateValue = (type:string,validateResult:typeVaildation,inputValue:string) =>{
      if(type === 'email'){
          const emailValidate = { ...validateResult, value: inputValue };
          console.log('emailValidate',emailValidate)
          setEmailValidate(emailValidate)
      }
      else if(type === 'password'){
        const passwordValidate = { ...validateResult, value: inputValue };
        setPasswordValidate(passwordValidate)
      }
      else if(type === 'newPassword'){
      const newPasswordValidate = { ...validateResult, value: inputValue };
      setNewPasswordValidate(newPasswordValidate)
    }
    else if(type === 'confirmPassword'){
      const confirmPasswordValidate = { ...validateResult, value: inputValue };
      setPasswordConfirmValidate(confirmPasswordValidate)
    }
    else if(type === 'SMS Code'){
      const SmsEncodedCheckCodeValidate = { ...validateResult, value: inputValue };
      console.log('SmsEncodedCheckCodeValidate',SmsEncodedCheckCodeValidate)
      setSmsEncodedCheckCodeValidate(SmsEncodedCheckCodeValidate)
  }
  else if(type === 'Email Code'){
    const emailSmsEncodedCheckCodeValidate = { ...validateResult, value: inputValue };
    console.log('emailSmsEncodedCheckCodeValidate',emailSmsEncodedCheckCodeValidate)
    setEmailSmsEncodedCheckCodeValidate(emailSmsEncodedCheckCodeValidate)
}
  }
  const sendPhoneNumber = (value:any) => {
    console.log(value,'sss')
    setIsValidPhoneInput(value);
  }
      const handleFormChange = (value:string) =>{
        console.log('setIsShowPassword')
        setIsShowPassword(false);
        changeToRegister(value);
        passwordValueInit();
      }
      return (
        <>
            {/* <Loading loading={loginMutation.isLoading} data={loginMutation.}></Loading> */}
          <div className={style.loginbox}>
      
            {requestType === 'recreatePassword' ? (
              <form onSubmit={(e) => handleSubmit(e, 'recreatePassword')}>
                <CustomValidaterInput sendValidateValue={sendValidateValue} type={'email'}></CustomValidaterInput>
      
                {emailValidate.touched && !emailValidate.error ? (
                  <Button width={'large'} type="submit">Send</Button>
                ) : (
                  <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                )}
      
                {/* <FlashMessage handleOnclick={handleOnclick} /> */}
              </form>
            ) : requestType === 'updatePassword' ? (
              <form onSubmit={(e) => handleSubmit(e, 'updatePassword')}>
                <CustomValidaterInput sendValidateValue={sendValidateValue} type={'password'}></CustomValidaterInput>

                <CustomValidaterInput sendValidateValue={sendValidateValue} passwordConfirm={passwordValidate.value} type={'newPassword'}></CustomValidaterInput>
      
                <CustomValidaterInput sendValidateValue={sendValidateValue} passwordConfirm={newPasswordValidate.value} type={'confirmPassword'}></CustomValidaterInput>
      
                {newPasswordValidate.touched && !newPasswordValidate.error && passwordValidate.touched && !passwordValidate.error && passwordConfirmValidate.touched && !passwordConfirmValidate.error ? (
                  <Button width={'large'} type="submit">Send</Button>
                ) : (
                  <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                )}
      
                {/* <FlashMessage handleOnclick={handleOnclick} /> */}
              </form>
            ) : requestType === 'encodedCheckCode' ? (
              <form onSubmit={(e) => handleSubmit(e, 'encodedCheckCode')}>
             <CustomValidaterInput sendValidateValue={sendValidateValue} type={'encodedCheckCode'}></CustomValidaterInput>
      
                {encodedCheckCodeValidate.touched && !encodedCheckCodeValidate.error ? (
                  <Button width={'large'} type="submit">Send</Button>
                ) : (
                  <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                )}
      
                {/* <FlashMessage handleOnclick={handleOnclick} /> */}
              </form>
            ) : requestType === 'login' ? (
              <form onSubmit={(e) => handleSubmit(e, 'login')}>
                <CustomValidaterInput sendValidateValue={sendValidateValue} type={'email'}></CustomValidaterInput>
                {isShowPassword ? (
                  <>
                    <CustomValidaterInput sendValidateValue={sendValidateValue} type={'password'}></CustomValidaterInput>
                    <div className={style.recreatePassword__container}>
                      <Link className={style.recreatePassword__container__p} to="/forget/password">
                        Forgot Password?
                      </Link>
                    </div>
                  </>
                ) : null}
  
                {!isShowPassword ? (
                  emailValidate.touched && !emailValidate.error ? (
                    <Button width={'large'} type="submit">Send</Button>
                  ) : (
                    <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                  )
                ) : (
                  passwordValidate.touched && !passwordValidate.error && emailValidate.touched && !emailValidate.error ? (
                    <Button width={'large'} type="submit">Send</Button>
                  ) : (
                    <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                  )
                )}
      
                {/* <FlashMessage handleOnclick={handleOnclick} /> */}
                <div className={style.register__container}>
                  <p className={style.register__container__p}>Don't have an account?</p>
                  <p className={style.register__container__join_p} onClick={() => handleFormChange('register')}>Join</p>
                </div>
              </form>
            ) : requestType === 'register' ? (
              <form onSubmit={(e) => handleSubmit(e, 'register')}>
                <CustomValidaterInput sendValidateValue={sendValidateValue} type={'email'}></CustomValidaterInput>
      
                {isShowPassword ? (
                  <>
               <CustomValidaterInput sendValidateValue={sendValidateValue} type={'password'}></CustomValidaterInput>
               <CustomValidaterInput passwordConfirm={passwordValidate.value} sendValidateValue={sendValidateValue} type={'confirmPassword'}></CustomValidaterInput>
                  </>
                ) : null}
      
                {!isShowPassword ? (
                  emailValidate.touched && !emailValidate.error ? (
                    <Button width={'large'} type="submit">Send</Button>
                  ) : (
                    <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                  )
                ) : (
                  passwordConfirmValidate.touched && !passwordConfirmValidate.error && passwordValidate.touched && !passwordValidate.error && emailValidate.touched && !emailValidate.error ? (
                    <Button width={'large'} type="submit">Send</Button>
                  ) : (
                    <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                  )
                )}
      
                <div className={style.register__container}>
                  <p className={style.register__container__p}>Already have an account?</p>
                  <p className={style.register__container__join_p} onClick={() => handleFormChange('login')}>Login</p>
                </div>
              </form>
             ) : requestType === 'smsRequest' ? (
              <form onSubmit={(e) => handleSubmit(e,'smsRequest')}>
                {/* <CustomValidaterInput sendValidateValue={sendValidateValue} type={'phone Number'}></CustomValidaterInput> */}



                <PhoneInput value={''} onChanges={sendPhoneNumber}></PhoneInput>
                {/* {!isValidPhoneInput && <div style={{ color: 'red' }}>Phone is not valid</div> }
                <div className={style.userbox__vaildateMsg}>
                  <p>{validateResult.message}</p>
                </div> */}
    
      
  
                  {isValidPhoneInput.touched && !isValidPhoneInput.error ? (
                    <Button width={'large'} type="submit">Send</Button>
                  ) : (
                    <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                  )}
                
      
                <div className={style.register__container}>
                  <p className={style.register__container__p}>Already have an account?</p>
                  <p className={style.register__container__join_p} onClick={() => handleFormChange('login')}>Login</p>
                </div>
</form>)
              :requestType === 'smsVerification' ? (
                <form onSubmit={(e) => handleSubmit(e, 'smsVerification')}>
                  <CustomValidaterInput sendValidateValue={sendValidateValue} type={'SMS Code'}></CustomValidaterInput>
                  { smsEncodedCheckCodeValidate.touched && !smsEncodedCheckCodeValidate.error && smsEncodedCheckCodeValidate.touched && !smsEncodedCheckCodeValidate.error && smsEncodedCheckCodeValidate.touched && !smsEncodedCheckCodeValidate.error ? 
                      <Button width={'large'} color={'f-white'}type="submit">Send</Button>
                     : 
                      <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send!</Button>        
                  }
                </form>)
                :
                requestType === 'emailResponse' ? (
                  <form onSubmit={(e) => handleSubmit(e, 'emailResponse')}>
                    <CustomValidaterInput sendValidateValue={sendValidateValue} type={'Email Code'}></CustomValidaterInput>
                    { isValidPhoneInput.touched && !isValidPhoneInput.error && isValidPhoneInput.touched && !isValidPhoneInput.error && isValidPhoneInput.touched && !isValidPhoneInput.error ? 
                        <Button width={'large'} color={'f-white'}type="submit">Send</Button>
                       : 
                        <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send!</Button>        
                    }
                  </form>)
                  :
            null}
          </div>
          </>
      );
    }
      
    
export default MobileLogin;