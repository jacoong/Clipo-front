
import {useContext,useEffect,useState} from 'react';
import LoginForm from '../../../compoents/LoginForm';
import { useLocation,useNavigate, useOutletContext } from 'react-router-dom';
import { useTheme } from '../../../customHook/useTheme';

function SmsAuthentication() {

  const location = useLocation();
  const navigate = useNavigate();
  const { isDark: themeIsDark } = useTheme();
  const outletContext = useOutletContext<{ isDark: boolean }>();
  const isDark = outletContext?.isDark ?? themeIsDark;

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
                  <LoginForm  userInfo={userInfo} changeToRegister={handleSubmit} requestType={'smsVerification'} isDark={isDark} />
    )
    }
    
export default SmsAuthentication;