import {useContext,useEffect,useState,ReactNode,useRef,useCallback, useMemo} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { AxiosError } from 'axios';
import {useTheme} from '../../customHook/useTheme';
import {userPost,userPosts} from '../../store/types';
import { useInfiniteQuery } from "react-query";
import Services from '../../store/ApiService';
import Postholder from '../../compoents/Posts/Postholder';
import PostCreator from '../../compoents/Posts/PostCreator';
import Followholder from '../../compoents/AccountCard/Followholder';



const {SocialService } = Services;

type typeOfFilter = 'MainRandom' | 'Post' | 'Replies' | 'Likes' |'Reply'|'Following'|'Follower';

interface TypeOfValuesPostsProps {
  typeOfFilter: typeOfFilter;
  username?: string;
  bno?: number;
  rno?: number;
}

function TypeOfValuesPosts({typeOfFilter,username,bno,rno}:TypeOfValuesPostsProps) {


        const observerTarget = useRef<HTMLDivElement | null>(null);
        // const [userInfo,setUserInfo] = useState<UserType>()
        const { isDark } = useTheme();

        const queryFn = async ({ pageParam = 0 }) => {
          if (typeOfFilter === 'MainRandom') {
            const res = await SocialService.fetchPosts(pageParam);
            return res.data;
          } else if (
            typeOfFilter === 'Post' ||
            typeOfFilter === 'Replies' ||
            typeOfFilter === 'Likes'
          ) {
            const value = { username:username, typeOfFilter, pages: pageParam };
            const res = await SocialService.fetchUserPosts(value);
            return res.data;
          } else if(
            typeOfFilter === 'Reply'
          ){
            const res = await SocialService.fetchedReply(bno as number, pageParam);
          return res.data;
          }
          else if(
            typeOfFilter === 'Following'||typeOfFilter==='Follower'
          ){
            const value = {username:username, typeOfFilter };
            console.log(value,'value ee');
            const res = await SocialService.fetchedFollowingFollower(value,pageParam);
            console.log(res);
            return res.data;
          }
        else
          {
            throw new Error(`알 수 없는 typeOfFilter 값: ${typeOfFilter}`);
          }
        };


        const {
          data,
          fetchNextPage,
          hasNextPage,
          isFetchingNextPage,
        } = useInfiniteQuery<any, AxiosError<{ message: string }>>(
          ['fetchPosts', typeOfFilter, username],
          queryFn,
          {
            getNextPageParam: (lastPage, allPages) => {
              console.log(lastPage,allPages)
              const fetchedDate = lastPage.body;
              if (fetchedDate.length === 0) {
                return undefined;
              }
              return allPages.length;
            },
            onError: (error: AxiosError) => {
              console.log(error.response || 'fetch post 실패');
            },
          }
        );


        const posts = data?.pages.flatMap((page) => page.body) || [];
        


        const handleObserver = useCallback(
          (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
              console.log('fetchNextPage');
              fetchNextPage();
            }
          },
          [hasNextPage]
        );
 

      
        
      useMemo(() => {
        console.log('rerender')
        const observer = new IntersectionObserver(handleObserver, {
          threshold: 0.1,
        });
        if (observerTarget.current) {
          observer.observe(observerTarget.current);
        }
  // Cleanup: Observer를 해제하여 메모리 누수 방지
        return () => {
          if (observerTarget.current) {
            observer.disconnect();
          }
        };
      }, [handleObserver]); // handleObserver를 종속성으로 포함
        
 

          return (
            <>

{typeOfFilter === 'Following' || typeOfFilter === 'Follower' ? (
  // <div></div>
      <Followholder isDark={isDark} accountInfo={posts}></Followholder>
    ) : (
      <Postholder isDark={isDark} fetchedPosts={posts} />
    )}
              
          
          
     {isFetchingNextPage ? (
        <div>더 불러오는 중...</div>
      ) : hasNextPage ? (
        <div
          ref={observerTarget}
          style={{ backgroundColor: 'red', height:'20px' ,width: '100%' }}
        />
      ) : (
        <div>더 이상 정보가 없습니다.</div>
      )}
            </>
          );
  }
    
export default TypeOfValuesPosts;
