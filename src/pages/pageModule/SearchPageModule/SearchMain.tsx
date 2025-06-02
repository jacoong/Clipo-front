import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal';
import useNavInfo from '../../../customHook/useNavInfo';
import {useTheme} from '../../../customHook/useTheme';
import {userPost} from '../../../store/types';
import { useMutation } from "react-query";
import Services from '../../../store/ApiService';
import SearchInput from '../../../compoents/SearchInput';
import SearchTagPagenation from '../pageKit/SearchTagPagenation';
import SearchTag from '../../../compoents/AccountCard/SearchTag';
// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }



export interface SearchFilterType {
  filter: 'Account' | 'Hashtag';
  value: string | null;
}


const SearchMain =()=>{
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
    const [searchFilter,setSearchFilter] = useState<SearchFilterType>({filter:'Account',value:null});

    updateNavInfo({type:'search',titleValue:'검색'})

    const detectValueAndFilter = (result:SearchFilterType) => {
      console.log("감지된 :", result);
      setSearchFilter(result);
      // 필요하다면 값 저장도 가능 (예: setSearchValue(value);)
    };
    return(
        <>
                <SearchInput isDark={isDark} searchFilter={searchFilter} detectValueAndFilter={detectValueAndFilter}></SearchInput>
                <SearchTagPagenation isDark={isDark} typeOfFilter={searchFilter.filter} value={searchFilter.value}></SearchTagPagenation>
        </>
    )
}

export default SearchMain;