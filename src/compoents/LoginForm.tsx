import {useContext,useEffect,useState,useRef} from 'react';
import Loading from './Loading';
import CustomValidaterInput from './CustomValidaterInput';
import { useNavigate,useLocation,Link } from 'react-router-dom'; 
import PhoneInput from '../compoents/PhoneInput';
import Button from './Button';
import Services from '../store/ApiService'
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import { LoginType,SMS,SMSValidate,LogInServerResponse } from '../store/types';
import { LoginLogic } from '../store/axios_context';
import { typeVaildation } from '../store/types';

type LoginPropsType = {
  nextPopUpPage?:()=>void;
  requestType:string;
  userInfo?:any;
  changeToRegister: (type:string)=> void;
}


const { AuthService, UserService } = Services;

type RequestTypeOnly = LoginPropsType['requestType'];
function LoginForm({userInfo,nextPopUpPage,requestType,changeToRegister}:LoginPropsType) {
        // const todoCtx = useContext(TodosContext);
 
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
        
        const navigate = useNavigate();

        const loginMutation = useMutation<LogInServerResponse, AxiosError<{ message: string }>, LoginType>(AuthService.login, {
          onSuccess: (res) => {
            console.log('mutation data',res.data)
            const accessToken = res.data.body.accessToken.replace("Bearer ", "");  // should change depend on adress
            const refreshToken = res.data.body.refreshToken.replace("Bearer ", "");  // should change depend on adress
            const validateTime = res.data.body.validateTime;  // should change depend on adress
            LoginLogic({accessToken,refreshToken,validateTime})
            navigate('/main')
        },
        onError: (error:AxiosError) => {
          if(error.response?.status === 401){
            // console.log(error.response)
            navigate('/validatePage',{ state: {email:emailValidate.value}});
          }else{
            alert('fail to login')
            console.log(error.response?.data)
          }
        }
        });

        const signUpMutation = useMutation<void, AxiosError<{ message: string }>, LoginType>(AuthService.signUp, {
          onSuccess: () => {
            navigate('/validatePage',{ state: {email:emailValidate.value}});
          },
          onError: (error:AxiosError) => {
            alert(error.response?.data ||'회원가입 실패');
          }
        });
        
        const smsRequestMutation = useMutation<void, AxiosError<{ message: string }>, SMS>(AuthService.smsRequest, {
          onSuccess: () => {
            navigate('/validatePage/authentication',{ state: {email:userInfo.email, phone:isValidPhoneInput.value}});
          },
          onError: (error:AxiosError) => {
            alert(error.response?.data || 'SMS 요청 실패');
          }
        });

        const forgetPasswordMutation = useMutation<void, AxiosError<{ message: string }>, string>(AuthService.forgetPassword, {
          onSuccess: () => {
            navigate('/');
            // popup check your mail box!
          },
          onError: (error:AxiosError) => {
            alert(error.response || '요청 실패');
          }
        });
        
        const smsVerificationMutation = useMutation<void, AxiosError<{ message: string }>,SMSValidate>(AuthService.smsVerificate, {
          onSuccess: () => {
            alert('SMS 인증 성공');
            navigate('/main');
          },
          onError: (error:AxiosError) => {
            alert(error.response?.data || 'SMS 인증 실패');
          }
        });
        
        const updatePasswordMutation = useMutation(AuthService.updatePassword, {
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, requestType: string) => {
      e.preventDefault();
  
      if (requestType === 'smsRequest') {
        const smsNumber = isValidPhoneInput.value;
        const requestBody = { phone: smsNumber, email:userInfo.email, password:userInfo.password };
        smsRequestMutation.mutate(requestBody);
      } 
      else if (requestType === 'forgetPassword') {
      const smsNumber = isValidPhoneInput.value;  
      console.log(smsNumber)
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
          <div className='w-full my-3.5'>
      
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
                    <div className='mb-1.5 pt-1.5'>
                      <Link className='cursor-pointer' to="/forget/password">
                        Forgot Password?
                      </Link>
                    </div>
                  </>
                ) : null}
  
                {!isShowPassword ? (
                  emailValidate.touched && !emailValidate.error ? (
                    <Button width={'large'} color={'white'} type="submit">Send</Button>
                  ) : (
                    <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                  )
                ) : (
                  passwordValidate.touched && !passwordValidate.error && emailValidate.touched && !emailValidate.error ? (
                    <Button width={'large'} color={'white'} type="submit">Send</Button>
                  ) : (
                    <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                  )
                )}
      
                {/* <FlashMessage handleOnclick={handleOnclick} /> */}
                <div className='mt-4 text-center'>
                  <p className='mr-1.5'>Don't have an account?</p>
                  <p className='cursor-pointe text-themeColor' onClick={() => handleFormChange('register')}>Join</p>
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
      
                <div className='mt-4 text-center'>
                  <p className='mr-1.5'>Already have an account?</p>
                  <p className='cursor-pointe text-themeColor' onClick={() => handleFormChange('login')}>Login</p>
                </div>
              </form>
             ) : requestType === 'smsRequest' ? (
              <form onSubmit={(e) => handleSubmit(e,'smsRequest')}>
                <PhoneInput value={''} onChanges={sendPhoneNumber}></PhoneInput>
                  {isValidPhoneInput.touched && !isValidPhoneInput.error ? (
                    <Button width={'large'} type="submit">Send</Button>
                  ) : (
                    <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                  )}
    
</form>)
     : requestType === 'forgetPassword' ? (
            <form onSubmit={(e) => handleSubmit(e,'forgetPassword')}>
              <PhoneInput value={''} onChanges={sendPhoneNumber}></PhoneInput>
                {isValidPhoneInput.touched && !isValidPhoneInput.error ? (
                  <Button width={'large'} type="submit">Send</Button>
                ) : (
                  <Button width={'large'} background_color={'b-gary'} disabled={true} type="submit">Send</Button>
                )}
              <div className='mt-4 text-center'>
                <p className='mr-1.5'>Already have an account?</p>
                <p className='cursor-pointe text-themeColor' onClick={() => handleFormChange('login')}>Login</p>
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
      
    
export default LoginForm;