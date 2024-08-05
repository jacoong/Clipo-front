
import { BrowserRouter as Router, Routes, Route ,Outlet} from 'react-router-dom';
import {addResponseInterceptor,addAccessTokenInterceptor} from './store/axios_context'
import Home from './pages/HomePage';
import { useState,useEffect } from 'react';
import Login from './pages/pageModule/Login';
import SmsRequest from './pages/pageModule/SmsRequest';
import EmailAuthentication from './pages/pageModule/EmailAuthentication';
import UpdatePassword from './pages/pageModule/UpdatePassword';
import SmsAuthentication from './pages/pageModule/SmsAuthentication';
import MainPage from './pages/MainPage';
import SocialLoginPage from './pages/SocialLoginPage';
import ConfirmPage from './pages/ConfirmPage';
import PageNotFound from './pages/PageNotFound';
import { setCookie,getCookie,removeCookie } from './store/coockie'; 
import ForgetPassword from './pages/pageModule/ForgetPassword'
import ThemeCompoent from './pages/pageModule/ThemeCompoent'
import { ThemeProvider } from './store/ThemeContext';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import ModalCompoent from './compoents/Modal/ModalCompoent';
import { Provider } from 'react-redux';
import {store} from './store/index';
// import MainPage from './compoent/pages/MainPage'
// import RegisterUsername from './compoent/pages/Username'
// import UserPage from './compoent/pages/UserPage';
// import PostPage from './compoent/pages/PostPage';
// import AiEventCalendar/age from './compoent/pages/AiEventCalendarPage';
// import PageKit from './compoent/pages/PageKit'
// import InvitePage from './compoent/pages/InvitePage'
// import IsInviterInvolve from './compoent/pages/IsInviterInvolve'
// import EventDetailPage from './compoent/pages/EventDetailPage'
// import Admin from './compoent/pages/AdminPage'
// import SocialLoginPage from './compoent/pages/SocialLoginPage'
// import {CookiesProvider} from 'react-cookie';
// import {setCookie,getCookie,removeCookie} from './store/coockie'
// import {addResponseInterceptor,addAccessTokenInterceptor} from './store/axios_context'

function App() {
  
  const initAxios = () => {
    // 로그인 후에 저장된 액세스 토큰을 가져와서 인터셉터에 추가합니다.
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      addAccessTokenInterceptor(accessToken);
    }
    // 인터셉터 추가
    addResponseInterceptor();
  };

  initAxios();
  const queryClient = new QueryClient()



return(
  <Provider store={store}> 
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeCompoent>
            <Router>
                  <Routes>
                    {/* <Route path='/register'  element={<Register />}/> */}
                    <Route path='/'  element={<Home />}>
                        <Route path=''  element={<Login/>}/>
                        <Route path="sms/request" element={<SmsRequest/>}/>
                        <Route path="sms/authentication" element={<SmsAuthentication/>}/>
                        <Route path="email/authentication" element={<EmailAuthentication/>}/>
                        <Route path="forget/password" element={<ForgetPassword/>}/>
                  </Route>

                  <Route path='/main'  element={<MainPage />}>
                        {/* <Route path='/mypage'  element={<MyPage/>}/> */}
                  </Route>


                    <Route path='/auth/:typeOfPlatform'  element={<SocialLoginPage/>}/>
                    <Route path='/updatePassword'  element={<UpdatePassword />}/>
                    <Route path='/Confirm'  element={<ConfirmPage/>}/>
                    {/* <Route path='/main'  element={<MainPgage/>}/> */}
                
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
            </Router>
            <ModalCompoent></ModalCompoent>
        </ThemeCompoent>
      </QueryClientProvider>
    </ThemeProvider>
  </Provider>
  );
}

export default App;
