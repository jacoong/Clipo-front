import {useContext,useEffect,useState,ReactNode,useRef} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { AxiosError } from 'axios';
// import style from './pageCss/MainPage.module.css;
import useModal from '../../../customHook/useModal';
import {useTheme} from '../../../customHook/useTheme';
import {activityType, userPost} from '../../../store/types';
import PageNationStandard from '../pageKit/PageNationStandard.tsx';
// import Loading from '../pages/pageModule/Loading';
import { useMutation } from "react-query";
import Services from '../../../store/ApiService';
import Postholder from '../../../compoents/Posts/Postholder';
import PostCreator from '../../../compoents/Posts/PostCreator';
import useNavInfo from '../../../customHook/useNavInfo';
import usePushNotification from '../../../customHook/usePushNotification'
import {useQueryClient} from 'react-query';
import RecommandPost from './HomeMenuType/RecommandPost';
// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }


// titleValue 가 Default 면 MainRandom 아니면 그에 맞게 typeOfFilter 하고 value 에서 있는방식으로 

function HomeMenu() {
        const { isDark } = useTheme();

        const { fireNotificationWithTimeout } = usePushNotification();
        const queryClient = useQueryClient();


        
        const handleClick = () => {
          console.log('ss')
         fireNotificationWithTimeout({
              data: {
                nno:17,
                type: 'reply' as activityType,
                from: 'sefe',
                bno: 10,
                rno: 31,
                nestRe: null,
              },
            });
        };

  
        useEffect(()=>{
          console.log('HomeMenu')
          queryClient.refetchQueries(['fetchPosts'])
        },[])

          return (
            <>
            {/* <div className='w-full h-7 bg-red-500' onClick={()=>handleClick()}>click</div> */}
            <PostCreator isDark={isDark}></PostCreator>
            {/* <TypeOfValuesPosts typeOfFilter={'MainRandom'}></TypeOfValuesPosts> */}
            <Outlet/>
            </>
          );
  }
    
export default HomeMenu;
