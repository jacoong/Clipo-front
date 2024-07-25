// import {TodosContext} from '../../store/todo_context'
import {useContext,useEffect,useState,useRef} from 'react';
import Loading from './Loading';
import CustomValidaterInput from './CustomValidaterInput';
import { useNavigate,useLocation,Link } from 'react-router-dom'; // If yo
import style from '../compoents/compoentsCss/MobileLogin.module.css';
import PhoneInput from '../compoents/PhoneInput';
import Button from './Button';
import useAxios from '../customHook/useAxios';
import {isPhoneValid} from '../store/validator'
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

        const [{ response: loginResponse, error: loginError, loading: loginLoading }, loginRequest] = useAxios({
          method: "post",
          url: "api/auth/login"
        });

        const [{ response: registerResponse, error: registerError, loading: registerLoading }, registerRequest] = useAxios({
          method: "post",
          url: "api/auth/signup"
        });

        const [{ response: smsRequestResponse, error: smsRequestError, loading: smsRequestLoading }, smsRequest] = useAxios({
          method: "post",
          url: "api/auth/send/phone"
        });

        const [{ response: smsValidateResponse, error: smsValidateError, loading: smsValidateLoading4 }, smsValidateRequest] = useAxios({
          method: "post",
          url: "api/auth/send/verification"
        });

        const [{ response: updatePWResponse, error: updatePWError, loading: updatePWLoading }, updatePWRequest] = useAxios({
          method: "post",
          url: "api/update/password"
        });



          const passwordValueInit = () =>{
              setPasswordValidate({touched: false, error: false, message: '',value:''})
          }
        const handleSubmit = async(e:React.FormEvent<HTMLFormElement>,requestType: RequestTypeOnly) => {
          e.preventDefault();
          // let emailRefValue = null
          if(requestType === 'SmsRequest'){
            const smsNumber = isValidPhoneInput.value;
            const requestBody = {phone:smsNumber}
            smsRequest(requestBody)
            if(smsRequestResponse){
              navigate('sms/authentication')
            }else{
            alert(registerError)
          }
          } 
          else if(requestType === 'smsVerification'){
            const smsVerificationCode = smsEncodedCheckCodeValidate.value;
            const requestBody = {validateSMSCode:smsVerificationCode}
            smsValidateRequest(requestBody)
            if(smsValidateResponse){
              return smsValidateResponse
            }else{
            alert(registerError)
          }
          } 
          else if(requestType === 'login'){
            const emailValue = emailValidate.value;
            const passwordValue = passwordValidate.value;
            const requestBody = {email:emailValue,password:passwordValue}
            if(passwordValue){
                loginRequest(requestBody);
                if(loginResponse){
                  navigate('/main')
              }else{
                alert(registerError)
              }
            }else{
                setIsShowPassword(true)
            }
          }
          else if(requestType === 'register'){
            const emailValue = emailValidate.value;
            const passwordValue = passwordValidate.value;
            const requestBody = {email:emailValue,password:passwordValue}
            if(passwordValue){
              registerRequest(requestBody);
              if(registerResponse){
                  navigate('sms/request')
              }else{
                alert(registerError)
              }
            }else{
                setIsShowPassword(true)
            }
          }
          else if(requestType === 'updatePassword'){
            const prepassword = passwordValidate.value;
            const newPasswordValue = newPasswordValidate.value;
            const requestBody = {newPassword:newPasswordValue,oldPassword:prepassword}
            updatePWRequest(requestBody);
              if(updatePWResponse){ 
                  alert('비밀번호 수정 완료')
              }else{
                alert(registerError)
              }
          }
          passwordValueInit()
            }

      const LoginLogic = async(emailValue:string,passwordValue:string)=>{
        console.log('LoginLogic worked')
        loginRequest();
      }

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
            <Loading loading={loginLoading} data={loginResponse}></Loading>
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
                      <Link className={style.recreatePassword__container__p} to="/sms/request">
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
              :requestType === 'smsResponse' ? (
                <form onSubmit={(e) => handleSubmit(e, 'smsResponse')}>
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