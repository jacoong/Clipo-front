import axios from 'axios';
import {setCookie,getCookie,removeCookie} from './coockie'
// import { useNavigate } from 'react-router-dom'; // If yo

// const navigate = useNavigate();

type typeOfTokens = {
    refreshToken:string,
    validateTime:string,
    accessToken:string
  }


export const SERVERURL = process.env.REACT_APP_SERVER_URL as string;

export const refreshAxios = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
  });

  export  const instance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
  });

  export  const formInstance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
    headers: {

      }
  });

  export  const Axios = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
    headers: {

      }
  });

  // const axiosConfig: AxiosRequestConfig = {
  //   ...config,
  //   withCredentials: true, // CORS 요청 시 자격 증명 포함
  //   headers: {
  //     'Content-Type': 'application/json', // GET, DELETE는 JSON, 나머지는 URL 인코딩
  //     ...config.headers,
  //   },
  // };




  interface LoginLogicType  {
    accessToken: string;
    refreshToken: string;
    validateTime: string;
  }


  export const LoginLogic = ({accessToken,refreshToken,validateTime}:LoginLogicType) =>{
          console.log('accessToken',accessToken,'refreshToken',refreshToken)
          addAccessResponseIntoCookie({accessToken,refreshToken,validateTime});
          // addAccessTokenInterceptor(accessToken);
          // addResponseInterceptor();
  
          // const previousUrl = localStorage.getItem('previousUrl');
          //   if(previousUrl){
          //     navigate(previousUrl);
          //     localStorage.removeItem('previousUrl');
          //   }else{
          //     console.log('??')
          //   }
          }





  export const addAccessTokenInterceptor = (accessToken: string) => {
    instance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${accessToken}`
        return config;
      },
      (error) => {
        delete error.config.headers.Authorization;
        return Promise.reject(error);
      }
    );
  };

  export const addResponseInterceptor = () => {
    instance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response.status === 403 && error.response.code === 'EXPIRED_TOKEN') {
        removeCookie('accessToken');
        const originalRequest = error.config;


        const newAccessToken = await fetchNewAccessToken();
        delete originalRequest.headers.Authorization;
        console.log('2.5',originalRequest)
        originalRequest.headers['Authorization'] =`Bearer ${newAccessToken}`;
        console.log('2',originalRequest)
        console.log('3')
        return refreshAxios(originalRequest)
      }
      else{
          console.error(error)
      }

    }
    );
  };

  export const fetchNewAccessToken = async () => {
      const refreshToken = getCookie('refreshToken')
      if(refreshToken){
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/recreate/accessToken`,{}, {
          headers:{
            Authorization:`Bearer ${refreshToken}`,
            withCredentials: true
          }
      })
      if (res.status === 200) {
        const accessToken = res.data.body.replace("Bearer ", "");;  // should change depend on adress
        const validateTime = 'sefescds';  // should change depend on adress
        addAccessTokenInterceptor(accessToken);
        addResponseInterceptor();
        addAccessResponseIntoCookie({accessToken,refreshToken,validateTime});
        console.log('1')
        return accessToken
      }
      else if(res.status === 301){
        removeCookie('refreshToken');
      }
    else{
      throw { code: 500, message: 'Unexpected Message' };
    }
    }
    };

export const addAccessResponseIntoCookie = ({accessToken,refreshToken,validateTime}:typeOfTokens)=>{
        console.log(accessToken,refreshToken,validateTime,)
        if(accessToken && refreshToken){
          

          setCookie('accessToken', accessToken, {
              path: '/',
              secure: '/',
              // expires: dateObject
          });
          setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: '/',
          });
      }
    }

