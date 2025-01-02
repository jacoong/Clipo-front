import {useContext,useEffect,useState,ReactNode,useRef} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { AxiosError } from 'axios';
// import style from './pageCss/MainPage.module.css;
import useModal from '../../../customHook/useModal';
import {useTheme} from '../../../customHook/useTheme';
import {userPost} from '../../../store/types';
import TypeOfValuesPosts from '../TypeOfValuesPosts';
// import Loading from '../pages/pageModule/Loading';
import { useMutation } from "react-query";
import Services from '../../../store/ApiService';
import Postholder from '../../../compoents/Posts/Postholder';
import PostCreator from '../../../compoents/Posts/PostCreator';
import useNavInfo from '../../../customHook/useNavInfo';
// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }


// titleValue 가 Default 면 MainRandom 아니면 그에 맞게 typeOfFilter 하고 value 에서 있는방식으로 

function HomeMenu() {
        const { isDark } = useTheme();
        const { updateNavInfo } = useNavInfo();
        updateNavInfo({titleValue:'추천'})
  
        useEffect(()=>{
          console.log('rerenderrrr')
        },[])
          return (
            <>
            <PostCreator isDark={isDark}></PostCreator>
            <TypeOfValuesPosts typeOfFilter={'MainRandom'}></TypeOfValuesPosts>
            </>
          );
  }
    
export default HomeMenu;
