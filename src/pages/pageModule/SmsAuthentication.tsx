
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
                  <MobileLogin  userInfo={userInfo} changeToRegister={handleSubmit} requestType={'smsVerification'} />
    )
    }
    
export default SmsAuthentication;