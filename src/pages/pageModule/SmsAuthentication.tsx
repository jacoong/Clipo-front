
import {useContext,useEffect,useState} from 'react';
import MobileLogin from '../../compoents/MobileLogin';
import { useLocation,useNavigate } from 'react-router-dom';

function SmsAuthentication() {

  const location = useLocation();
  const navigate = useNavigate();

  const [loginValue,setLoginValue] = useState<string>('login')
  const [userInfo,setUserInfo] = useState<any>(undefined)
      const handleSubmit = (value:string) =>{
            setLoginValue(value)
        }

        useEffect(() => {
          const userInfo = { ...location.state };
      
          // Check if userInfo is empty
          if (Object.keys(userInfo).length > 0) {
            console.log(userInfo);
            setUserInfo(userInfo);
          } else {
            navigate('/');
          }
        }, [location.state, navigate]);

    return(

                <section className="flex flex-col items-center justify-center p-10 bg-white rounded-md shadow-none w-96">
                <div className="py-5 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">휴대폰 번호로 인증받은 코드를 입력해 주십시오.</h1> 
                </div>
                <div className="px-10 py-5 bg-white rounded-md shadow-none w-96">
                  <MobileLogin  userInfo={userInfo} changeToRegister={handleSubmit} requestType={'smsVerification'} />
                </div>
              </section>
    )
    }
    
export default SmsAuthentication;