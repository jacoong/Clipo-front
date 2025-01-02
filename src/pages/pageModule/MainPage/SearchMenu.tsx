import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { AxiosError } from 'axios';
// import style from './pageCss/MainPage.module.css;
import useModal from '../../../customHook/useModal';
import useNavInfo from '../../../customHook/useNavInfo';
import {useTheme} from '../../../customHook/useTheme';
import {userPost} from '../../../store/types';
// import Loading from '../pages/pageModule/Loading';
import { useMutation } from "react-query";
import Services from '../../../store/ApiService';


// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }






function SearchMenu() {
  const {SocialService } = Services;
const { updateNavInfo } = useNavInfo();
        const navigate = useNavigate();
        const [isLoading, setIsLoading] = useState(true);
        const [isFullOfContents, setIsFullOfContents] = useState(false);
        const [page, setPage] = useState(0);
        const [fetchedPosts, setFetchedPosts] = useState<userPost[]>([]);
        // const [userInfo,setUserInfo] = useState<UserType>()
        const { openModal } = useModal();
        const { isDark } = useTheme();

        updateNavInfo({titleValue:'검색'})


          return (
            <>
            <div>ActivityMenu</div>
            </>
          );
  }
    
export default SearchMenu;