import axios from 'axios'
import { useNavigate,useParams } from 'react-router-dom';
import UserService from '../store/UserService';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import { socialLogin,LogInServerResponse } from '../store/types';
import { LoginLogic } from '../store/axios_context';




function SocialLoginPage() {


    const navigate = useNavigate();

    const socialLoginMutation = useMutation<LogInServerResponse, AxiosError<{ message: string }>, socialLogin>(UserService.socialLogin, {
        onSuccess: (data) => {
            console.log('mutation data')
            const accessToken = data.body.accessToken.replace("Bearer ", "");  // should change depend on adress
            const refreshToken = data.body.refreshToken.replace("Bearer ", "");  // should change depend on adress
            const validateTime = data.body.validateTime;  // should change depend on adress
            LoginLogic({accessToken,refreshToken,validateTime})
            navigate('/main')
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data || '로그인 실패');
        navigate('/404')
        
        }
      });



    const { typeOfPlatform } = useParams();

    const socialFuntion = async() =>{
        console.log('worked!')
    if(typeOfPlatform === 'google' || typeOfPlatform === 'kakao' || typeOfPlatform === 'naver'){
      const url = new URL(window.location.href);
      const codeParam: string | null = url.searchParams.get("code");
      console.log(typeOfPlatform,'typeOfPlanform')
      if (codeParam !== null) {
        const requestBody = {code:codeParam,typeOfPlatform:typeOfPlatform}
        socialLoginMutation.mutate(requestBody);
      }
    }
  }

 

  const socialRequest = async (codeParam:any) => {


    // axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/socialLogin/${typeOfPlanform}`, codeParam, {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then((res) => {
    //   if (res.status === 200) {
    //     const accessToken = res.data.body.accessToken.replace("Bearer ", "");  
    //     const refreshToken = res.data.body.refreshToken.replace("Bearer ", "");  
    //     const validateTime = res.data.body.validateTime;  
    //     console.log('같아야지', accessToken, 'ㅇㅇ', refreshToken);
    //     addAccessResponseIntoCookie({ accessToken, refreshToken, validateTime });
  
    //     const previousUrl = localStorage.getItem('previousUrl');
    //     if (previousUrl) {
    //       navigate(previousUrl);
    //       localStorage.removeItem('previousUrl');
    //     } else {
    //       console.log('??');
    //       navigate('/main');
    //     }
    //   }
    // })
    // .catch((error) => {
    //   console.error('에러 발생:', error);
    //   navigate('/404');
    // });
  };
          

    


   

    console.log('typeOfPlanform',typeOfPlatform)
    socialFuntion();

return(

    <div>
    </div>
  )
  }
  
  
  export default SocialLoginPage;