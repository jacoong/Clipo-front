import axios,{AxiosRequestConfig} from 'axios';
import {setCookie,getCookie,removeCookie} from './coockie'
import { store,RootState } from './index'; // redux store instance
import { openModal } from './modalSlice';
import { useNavigate } from 'react-router-dom';

// const navigate = useNavigate();

type typeOfTokens = {
    refreshToken:string,
    validateTime:string,
    accessToken:string
  }


export const SERVERURL = process.env.REACT_APP_SERVER_URL as string;
export const CLIENTURL = process.env.REACT_APP_CLIENT_URL as string;

// CORS 허용 URL 설정
const ALLOWED_ORIGINS = [
  process.env.REACT_APP_CLIENT_URL,
  'http://localhost:3000',

  'http://localhost:8000',
  // 프로덕션 도메인 추가
  'https://clipo.onrender.com',
  'https://clipofront.netlify.app',
].filter(Boolean); // undefined 값 제거

// CORS 헤더 설정 함수
const getCorsHeaders = () => {
  const origin = window.location.origin;
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24시간
  };
};

export const refreshAxios = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
    headers: getCorsHeaders(),
  });

  export  const instance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
    headers: getCorsHeaders(),
  });

  export  const formInstance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
    headers: getCorsHeaders(),
  });

  export  const Axios = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
    headers: getCorsHeaders(),
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
      console.log("Login Logic called",accessToken,refreshToken,validateTime)
          addAccessResponseIntoCookie({accessToken,refreshToken,validateTime});
          syncInstanceHeaders(accessToken);
          return
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


    instance.interceptors.request.use(
      (config) => {
        const accessToken = getCookie('accessToken');
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        // CORS 헤더 추가
        const corsHeaders = getCorsHeaders();
        Object.assign(config.headers, corsHeaders);
        
        return config;
      },
      (error) => {
        // 요청 설정 중 에러 발생 시
        return Promise.reject(error);
      }
    );
    
  

      instance.interceptors.response.use(
        response => response,
        async error => {
          const originalRequest = error.config as AxiosRequestConfig & { _retryCount?: number };
          
          // 1) Access Token 만료 → Refresh Token으로 재발급 시도
          if (error.response?.data?.status === 403 && 
              error.response.data.code === 'EXPIRED_TOKEN') {
            
    
            
            originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
            removeCookie('accessToken', { path: '/', secure: true });
            
            try {
              // Refresh Token으로 새 Access Token 발급
              const newToken = await fetchNewAccessToken();
              // 인스턴스 헤더 동기화
              syncInstanceHeaders(newToken);
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              
              // 새 토큰으로 원래 요청 재시도
              return instance(originalRequest);
            } catch (refreshError) {
              // Refresh Token도 만료된 경우 → MainPage에서 처리하도록 expiredToken 설정
              removeCookie('accessToken', { path: '/', secure: true });
              setCookie('refreshToken', 'expiredToken');
              // 세션 만료 시 홈페이지로 리다이렉트
              // redirectToHome();
              return Promise.reject(error);
            }
          }
          
          // 2) 변조된 토큰 → expiredToken 설정 후 재시도
          else if (error.response?.data?.status === 400 && 
                   error.response.data.code === 'NOT_VALIDATE_TOKEN') {
            // 새로운 요청 생성 (Request Interceptor에서 처리됨)
            return setExpiredTokenRequest();
          }
          
          // 3) 인증 실패 (401) → expiredToken 설정 후 재시도
          else if (error.response?.data?.status === 401) {
            // 새로운 요청 생성 (Request Interceptor에서 처리됨)
            return setExpiredTokenRequest();
          }
    
          // 4) 기타 403 에러 → expiredToken 설정 후 재시도
          else if (error.response?.data?.status === 403) {
            // 새로운 요청 생성 (Request Interceptor에서 처리됨)
            return setExpiredTokenRequest();
          }
          
          // 4) 네트워크 에러 (5xx, 연결 실패 등) → 재시도
          else if (error.response?.status >= 500 || !error.response) {
            // originalRequest가 존재하는지 확인
            if (!originalRequest) {
              return Promise.reject(error);
            }
            
            // 재시도 횟수 제한 (3회까지)
            if ((originalRequest._retryCount ?? 0) >= 3) {
              return Promise.reject(error);
            }
            
            originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;
            
            // 지수 백오프 (1초, 2초, 4초)
            const delay = Math.pow(2, originalRequest._retryCount - 1) * 1000;
            
            return new Promise(resolve => {
              setTimeout(() => {
                resolve(instance(originalRequest));
              }, delay);
            });
          }
          
          // 5) 기타 에러는 그대로 전파
          return Promise.reject(error);
        }
      );
  


// 토큰 갱신 후 인스턴스 헤더 동기화 함수
export const syncInstanceHeaders = (accessToken:string) => {
  if (accessToken) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

// 세션 만료 시 홈페이지로 리다이렉트하는 함수
const redirectToHome = () => {
  setCookie('refreshToken', 'expiredToken', {
    path: '/',
    secure: true,
  });
  // 브라우저 환경에서만 실행
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

// expiredToken 설정 후 새로운 요청 생성 함수
const setExpiredTokenRequest = () => {
  // accessToken 제거
  removeCookie('accessToken', { path: '/', secure: true });
  removeCookie('refreshToken', { path: '/', secure: true });
  delete instance.defaults.headers.common['Authorization'];
  // redirectToHome(); // temporarily disable auto-redirect to "/"
};



  export const fetchNewAccessToken = async () => {
    try{
      const refreshToken = getCookie('refreshToken')
      if(refreshToken){
        const corsHeaders = getCorsHeaders();
        const res = await axios.post(`${process.env.REACT_APP_SERVER_URL}api/auth/recreate/accessToken`,{}, {
          headers:{
            Authorization:`Bearer ${refreshToken}`,
            withCredentials: true,
            ...corsHeaders
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
        if(accessToken && refreshToken){
          

          setCookie('accessToken', accessToken, {
              path: '/',
              secure: true,
              // expires: dateObject
          });
          setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
          });
      }
    }
