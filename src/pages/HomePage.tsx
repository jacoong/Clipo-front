
import {useContext,useEffect,useState} from 'react';
// import {TodosContext} from '../../store/todo_context'
// import {instance} from '../../store/axios_context'
import style from './pageCss/LoginPage.module.css';
// import FlexBox,{TypeOfLoginValue} from '../compoentItem/FlexBox'
// import JoinForm from '../compoentItem/JoinForm';
// import {getCookie} from '../../store/coockie'
import { useNavigate,Outlet } from 'react-router-dom';
import MobileLogin from '../compoents/MobileLogin';
import SocialGoogle from '../compoents/SocialLogin/SocialGoogle';
import SocialKakao from '../compoents/SocialLogin/SocialKakao';
import SocialNaver from '../compoents/SocialLogin/SocialNaver';

function HomePage() {


    return(
        <div className="flex flex-col h-lvh">
  
        <div className="w-full h-full flex items-center justify-center p-20">
          <section className="flex items-center justify-center h-full w-96 bg-white p-10 shadow-none">
              <div className='w-32 h-32 bg-slate-500 '></div>
          </section> 
        <Outlet/>
        </div>
      </div>
    )
    }
    
    
export default HomePage;