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
import Postholder from '../../../compoents/Posts/Postholder';
import PostCreator from '../../../compoents/Posts/PostCreator';

// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }




const {SocialService } = Services;


function HomeMenu() {
        const navigate = useNavigate();
        const [isLoading, setIsLoading] = useState(true);
        const [isFullOfContents, setIsFullOfContents] = useState(false);
        const [page, setPage] = useState(0);
        const [fetchedPosts, setFetchedPosts] = useState<userPost[]>([]);
        // const [userInfo,setUserInfo] = useState<UserType>()
        const { openModal } = useModal();
        const { isDark } = useTheme();

        const fetchPostsMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.fetchPosts, {
          onSuccess: (res) => {
            setIsLoading(false);
            console.log('fetched Data:', res.data);
            const fetchedDate = res.data.body;
            if(fetchedDate.lenght === 0){
              return setIsFullOfContents(true);
            }
            setFetchedPosts((preData) => [...preData,...fetchedDate]);
          },
          onError: (error:AxiosError) => {
            console.log(error.response ||'fetch post 실패');
          }
        });

        const handleObserver = (entries: IntersectionObserverEntry[]) => {
          const target = entries[0];
          if (target.isIntersecting && !isLoading) {
            setIsLoading(true)
            setPage((prevPage) => prevPage + 1);
          }
        };

        useEffect(()=>{
          console.log(fetchedPosts)
        },[fetchedPosts])

        useEffect(() => {
          const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.3, //  Intersection Observer의 옵션, 0일 때는 교차점이 한 번만 발생해도 실행, 1은 모든 영역이 교차해야 콜백 함수가 실행.
          });
          // 최하단 요소를 관찰 대상으로 지정함
          const observerTarget = document.getElementById("observer");
          // 관찰 시작
          if (observerTarget) {
            observer.observe(observerTarget);
          }
        }, [fetchedPosts,isLoading]);

        useEffect(()=>{
            fetchPostsMutation.mutate(page)
            console.log(page)
        },[page])
        
          return (
            <>
            <PostCreator isDark={isDark}></PostCreator>
            <Postholder isDark={isDark} fetchedPosts={fetchedPosts}/>
            {isFullOfContents?
            <div>최대 계시글입니다.</div>
            :
            <div id="observer" style={{ height: "15px", backgroundColor: "red", width: "100%" }}>loading</div>
            }
            </>
          );
  }
    
export default HomeMenu;
