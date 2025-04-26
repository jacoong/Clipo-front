
import { BrowserRouter as Router, Routes, Route ,Outlet} from 'react-router-dom';
import {addResponseInterceptor,addAccessTokenInterceptor} from './store/axios_context'
import Home from './pages/HomePage';
import { useState,useEffect } from 'react';
import Login from './pages/pageModule/pageKit/Login';
import SmsRequest from './pages/pageModule/pageKit/SmsRequest';
import EmailAuthentication from './pages/pageModule/pageKit/EmailAuthentication';
import UpdatePassword from './pages/pageModule/pageKit/UpdatePassword';
import SmsAuthentication from './pages/pageModule/pageKit/SmsAuthentication';
import MainPage from './pages/MainPage';
import SocialLoginPage from './pages/SocialLoginPage';
import ConfirmPage from './pages/ConfirmPage';
import ValidatePage from './pages/ValidatePage';
import PageNotFound from './pages/PageNotFound';

import HomeMenu from './pages/pageModule/MainPage/HomeMenu';

import ProfileMenu from './pages/pageModule/MainPage/ProfileMenu';
import DetailPost from './pages/pageModule/MainPage/DetailPost';
import TagsPost from './pages/pageModule/SearchPageModule/TagsPost';


import SearchMenu from './pages/pageModule/MainPage/SearchMenu';
import SearchMain from './pages/pageModule/SearchPageModule/SearchMain';
import SearchResultPage from './pages/pageModule/SearchPageModule/SearchResultPage';

import ActivityMenu from './pages/pageModule/MainPage/ActivityMenu';
import ActivityMain from './pages/pageModule/ActivityModule/ActivityMain';



import { setCookie,getCookie,removeCookie } from './store/coockie'; 
import ForgetPassword from './pages/pageModule/pageKit/ForgetPassword'
import ThemeCompoent from './pages/pageModule/pageKit/ThemeCompoent'
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


const queryClient = new QueryClient()

function App() {
  
  const initAxios = () => {
    // 로그인 후에 저장된 액세스 토큰을 가져와서 인터셉터에 추가합니다.
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      addAccessTokenInterceptor();
      addResponseInterceptor();
    }
  };

  useEffect(() => {
    initAxios();    // 앱이 마운트될 때 단 한 번만 실행
  }, []);



return(
  <Provider store={store}> 
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeCompoent>
            <Router>
            <ModalCompoent></ModalCompoent>
                  <Routes>
                    {/* <Route path='/register'  element={<Register />}/> */}
                    <Route path='/'  element={<Home />}>
                        <Route path=''  element={<Login/>}/>
                        <Route path="forget/password" element={<ForgetPassword/>}/>
                        <Route path="email/authentication" element={<EmailAuthentication/>}/>
                  </Route>

                  <Route path='/validatePage'  element={<ValidatePage/>}>
                       <Route path="" element={<SmsRequest/>}/>
                        <Route path="authentication" element={<SmsAuthentication/>}/>
                  </Route>


                  <Route path='/main' element={<MainPage />}>
                  <Route index element={<HomeMenu />} />
                  <Route path='@/:username' element={<ProfileMenu />} />
                  <Route path='@/:username/post/:bno' element={<DetailPost />} />

                  {/* 중첩 구조로 SearchMenu 안에서 TagsPost */}
                  <Route path='search' element={<SearchMenu />}>
                    <Route path='' element={<SearchMain/>}></Route>
                    <Route path="type/:typeOfFilter" element={<SearchResultPage />} />
                    <Route path='tags/post/:tagValue' element={<TagsPost />} />
                  </Route>


                  <Route path='activity' element={<ActivityMenu />}>
                      <Route path='' element={<ActivityMain/>}></Route>
                      </Route>
                  </Route>


                    <Route path='/auth/:typeOfPlatform'  element={<SocialLoginPage/>}/>
                    <Route path='/updatePassword'  element={<UpdatePassword />}/>
                    <Route path='/Confirm'  element={<ConfirmPage/>}/>
                    {/* <Route path='/main'  element={<MainPgage/>}/> */}
                
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
            </Router>
        </ThemeCompoent>
      </QueryClientProvider>
    </ThemeProvider>
  </Provider>
  );
}

export default App;
