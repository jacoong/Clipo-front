
import {useContext,useEffect,useState} from 'react';
// import {TodosContext} from '../../store/todo_context'
// import {instance} from '../../store/axios_context'
import style from './pageCss/LoginPage.module.css';
// import FlexBox,{TypeOfLoginValue} from '../compoentItem/FlexBox'
// import JoinForm from '../compoentItem/JoinForm';
// import {getCookie} from '../../store/coockie'
import { useNavigate,Outlet } from 'react-router-dom';
import ThemeToggleButton from '../compoents/ThemeToggleButton';
import useModal from '../customHook/useModal';

function HomePage() {
    const { openModal } = useModal();
    const openFirstModal = () => {
        console.log('sfeesfsef');
        openModal({ type:'username', props: { isPotal:false,isForce:true } });
      };
      const opensecondModal = () => {
        openModal({ type: 'second',props: { isPotal:false}});
      };


    return(
        <div className="flex flex-col h-lvh">
  <ThemeToggleButton></ThemeToggleButton>
  <div className='relative bg-slate-900' onClick={openFirstModal}>clickme!</div>
  <div className='relative bg-red-50000' onClick={opensecondModal}>clickme!</div>
        <div className="w-full h-full flex items-center justify-center p-20">
          <section className="flex items-center justify-center h-full w-112 p-10 relative shadow-none">
              <div className='relative w-108 h-100'>
                  <div className='z-0 flex items-center justify-center w-104 h-100 absolute'>
                          <img className="z-10 w-full h-full absolute" src='./monitor.png'></img>
                          {/* <img className="top-4 w-54 h-90 absolute" src='./feedImage.png'></img> */}
                      </div>


                  <div className='bottom-0 right-0 z-10 flex items-center justify-center w-32 h-64 absolute'>
                      <img className="z-10 w-full h-full absolute" src='./iphone.png'></img>
                      <img className="top-2.5 w-28 h-59 absolute" src='./feedImage.png'></img>
                  </div>
              </div>
          </section> 
        <Outlet/>
        </div>
      </div>
    )
    }
    
    
export default HomePage;