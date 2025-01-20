
import {useContext,useEffect,useState} from 'react';
import MobileLogin from '../../../compoents/MobileLogin';
import { useLocation,useNavigate } from 'react-router-dom';

function SmsRequest() {
  const location = useLocation();
  const navigate = useNavigate();


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
                  <MobileLogin userInfo={userInfo} changeToRegister={changeToRegister} requestType={'smsRequest'} />
    )
    }
    
    
export default SmsRequest;