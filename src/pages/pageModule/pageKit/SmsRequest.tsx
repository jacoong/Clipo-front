
import {useContext,useEffect,useState} from 'react';
import LoginForm from '../../../compoents/LoginForm';
import { useLocation,useNavigate, useOutletContext } from 'react-router-dom';
import { useTheme } from '../../../customHook/useTheme';

function SmsRequest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark: themeIsDark } = useTheme();
  const outletContext = useOutletContext<{ isDark: boolean }>();
  const isDark = outletContext?.isDark ?? themeIsDark;

const [userInfo,setUserInfo] = useState<any>(undefined)


useEffect(() => {
  const userInfo = { ...location.state };

  // Check if userInfo is empty
  if (Object.keys(userInfo).length > 0) {
    const userInfoValue = userInfo;
    setUserInfo(userInfoValue);
  } else {
    navigate('/');
  }
}, [location.state, navigate]);


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
                  <LoginForm userInfo={userInfo} changeToRegister={changeToRegister} requestType={'smsRequest'} isDark={isDark} />
    )
    }
    
    
export default SmsRequest;