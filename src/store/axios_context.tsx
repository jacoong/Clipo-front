import axios,{AxiosRequestConfig} from 'axios';
import {setCookie,getCookie,removeCookie} from './coockie'
import { store,RootState } from './index'; // redux store instance
import { openModal } from './modalSlice';
// import { useNavigate } from 'react-router-dom'; // If yo

// const navigate = useNavigate();

type typeOfTokens = {
    refreshToken:string,
    validateTime:string,
    accessToken:string
  }


export const SERVERURL = process.env.REACT_APP_SERVER_URL as string;
export const CLIENTURL = process.env.REACT_APP_CLIENT_URL as string;

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
  interface RetriableRequest extends AxiosRequestConfig {
    _retry?: boolean;
  }



  interface LoginLogicType  {
    accessToken: string;
    refreshToken: string;
    validateTime: string;
  }


  export const LoginLogic = ({accessToken,refreshToken,validateTime}:LoginLogicType) =>{
          addAccessResponseIntoCookie({accessToken,refreshToken,validateTime});
          if (accessToken) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          }
  
          // const previousUrl = localStorage.getItem('previousUrl');
          //   if(previousUrl){
          //     navigate(previousUrl);
          //     localStorage.removeItem('previousUrl');
          //   }else{
          //     console.log('??')
          //   }
          }


    export function safeOpenModal(type: string, props: any) {
      const state = store.getState() as { modal: any };
      const modals = state.modal;
    
      const top = modals[modals.length - 1];
      if (top?.type === type) {
        return; // 이미 같은 모달이 떠 있으면 재 dispatch 안 함
      }
    
      store.dispatch(openModal({ type, props }));
    }

    export const getTopModal = ()=> {
      const state: RootState = store.getState();
      const modals = state.modal;        // ModalStates 타입: Array<{ type: string; props: ModalInitial }>
      return modals.length > 0
        ? modals[modals.length - 1]      // 배열 마지막 항목이 “가장 위” 모달
        : null;
    }


  export const addAccessTokenInterceptor = () => {
    instance.interceptors.request.use((config) => {
      const accessToken = getCookie('accessToken'); // ✅ 
      const refreshtoken = getCookie('refreshToken'); // 
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      else if(refreshtoken === 'expiredToken'){

        safeOpenModal('sessionExpired', {
          isForce: true,
          isPotal: false,
          modal: {
            width: '300px',
            height: '200px',
            isFull: false,
            navButtonOption: { isClose: false, isEdit: false, isDelete: false }
          }
        });
        // return Promise.reject(new axios.Cancel('Session expired — Request cancelled'));
      }
      // else {
      //   // 토큰이 없으면 헤더에서 제거
      //   if (config.headers && 'Authorization' in config.headers) {
      //     delete (config.headers as Record<string, any>)['Authorization'];
      //   }
      //   // 그리고 인스턴스 기본 헤더에도 혹시 남아 있으면 제거
      //   if (instance.defaults.headers.common['Authorization']) {
      //     delete instance.defaults.headers.common['Authorization'];
      //   }
      // }
      return config;
    });
  };

  export const addResponseInterceptor = () => {
    instance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config as AxiosRequestConfig & { _retryCount?: number };
  
        // 1) 토큰 만료 → 재발급 + 재요청
        if (error.response?.data?.status === 403 &&
            error.response.data.code === 'EXPIRED_TOKEN') {
          if ((originalRequest._retryCount ?? 0) >= 1) {
            return Promise.reject(error);
          }
  
          originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
          removeCookie('accessToken');
  
          try {
            const newToken = await fetchNewAccessToken();
            instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            // setCookie('accessToken', newToken);
            // originalRequest.headers = {
            //   ...originalRequest.headers,
            //   Authorization: `Bearer ${newToken}`,
            // };
            return
          } catch (refreshError) {
            setCookie('refreshToken', 'expiredToken');
            return 
          }
        }
  
        // 2) 변조된 토큰 → 강제 만료 처리
        else if (error.response?.data?.status === 400 &&
          error.response.data.code === 'NOT_VALIDATE_TOKEN') {
          removeCookie('accessToken');
          setCookie('refreshToken', 'expiredToken');
          return 
        }
        else if(error.response?.data?.status === 401){
          return 
        }
        return 
      }
    );
  };
  

  export const fetchNewAccessToken = async () => {
    try{
      const refreshToken = getCookie('refreshToken')
      if(refreshToken){
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/auth/recreate/accessToken`,{}, {
          headers:{
            Authorization:`Bearer ${refreshToken}`,
            withCredentials: true
          },
      })
      if (res.status === 200) {
        const accessToken = res.data.body.replace("Bearer ", "");;  // should change depend on adress
        const validateTime = 'sefescds';  // should change depend on adress
        addAccessResponseIntoCookie({accessToken,refreshToken,validateTime});
        return accessToken
      }
      else if(res.status === 301){ //리프레쉬가 만료되었을때 
        // removeCookie('refreshToken');
        throw { code: 500, message: 'Refresh expired' };
      }
      else if(res.status === 403){ //리프레쉬가 조작되었을때
        // removeCookie('refreshToken');
        throw { code: 500, message: 'Refresh taken' };
      }
      
      else{
        throw { code: 500, message: 'Unexpected Message' };
      }
    }
    } catch (error) {
      throw error
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

