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


  export const addAccessTokenInterceptor = () => { // to check refresh Token is Expired
  instance.interceptors.request.use((config) => {
    const refreshToken = getCookie('refreshToken');
    if(refreshToken === 'expiredToken'){
      console.log(refreshToken,'refreshToken')
      removeCookie('accessToken', { path: '/', secure: true });
      // 요청 완전 중단 (Response Interceptor 실행 안됨)
      return Promise.reject({
        message: 'Session expired - Request cancelled',
        code: 'SESSION_EXPIRED',
        status: 401,
        isSessionExpired: true
      });
    }
    
    // accessToken이 있으면 헤더에 추가
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete instance.defaults.headers.common['Authorization'];
    }
    
    return config;
  });
};

// 토큰 갱신 후 인스턴스 헤더 동기화 함수
export const syncInstanceHeaders = () => {
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

// expiredToken 설정 후 새로운 요청 생성 함수
const setExpiredTokenRequest = () => {
  // accessToken 제거
  removeCookie('accessToken', { path: '/', secure: true });
  // refreshToken을 expiredToken으로 설정
  setCookie('refreshToken', 'expiredToken');
  
  // 인스턴스 헤더에서도 accessToken 제거
  delete instance.defaults.headers.common['Authorization'];
  
  // 새로운 요청 생성 (Request Interceptor에서 expiredToken 감지하여 처리)
  return instance({
    method: 'GET',
    url: '/api/user/profile', // 기본 프로필 요청
    headers: {
      // Authorization 헤더 없이 요청
    }
  });
};

  export const addResponseInterceptor = () => {
  console.log('addResponseInterceptor')
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
          syncInstanceHeaders();
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          
          // 새 토큰으로 원래 요청 재시도
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh Token도 만료된 경우 → MainPage에서 처리하도록 expiredToken 설정
          removeCookie('accessToken', { path: '/', secure: true });
          setCookie('refreshToken', 'expiredToken');
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
              secure: true,
              // expires: dateObject
          });
          setCookie('refreshToken', refreshToken, {
            path: '/',
            secure: true,
          });
      }
    }

