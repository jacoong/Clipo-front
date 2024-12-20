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

// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }




function HomeMenu() {
        const { isDark } = useTheme();

  
          return (
            <>
            <PostCreator isDark={isDark}></PostCreator>
            <TypeOfValuesPosts typeOfFilter={'MainRandom'}></TypeOfValuesPosts>
            </>
          );
  }
    
export default HomeMenu;
