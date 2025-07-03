import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { AxiosError } from 'axios';
// import style from './pageCss/MainPage.module.css;
import useModal from '../../../customHook/useModal';
import {useTheme} from '../../../customHook/useTheme';
import {userPost} from '../../../store/types';
// import Loading from '../pages/pageModule/Loading';
import { useMutation } from "react-query";
import Services from '../../../store/ApiService';
import useNavInfo from '../../../customHook/useNavInfo';
import {useQueryClient} from 'react-query';
// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }




const {SocialService } = Services;


function ActivityMenu() {
        const navigate = useNavigate();
        const [isLoading, setIsLoading] = useState(true);
        const [isFullOfContents, setIsFullOfContents] = useState(false);
        const [page, setPage] = useState(0);
        const [fetchedPosts, setFetchedPosts] = useState<userPost[]>([]);
        // const [userInfo,setUserInfo] = useState<UserType>()
        const { openModal } = useModal();
        const { isDark } = useTheme();
        const queryClient = useQueryClient();
        const { updateNavInfo } = useNavInfo();
        updateNavInfo({type:'activity',titleValue:'활동'})

        useEffect(()=>{
          console.log('ActivityPage')
          queryClient.refetchQueries(['fetchPosts'])
        },[])

          return (
            <div className={`w-full h-auto `}>
            <Outlet/>
          </div>
          );
  }
    
export default ActivityMenu;