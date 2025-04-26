import {useContext,useEffect,useState,ReactNode,useRef,useCallback} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { AxiosError } from 'axios';
import {useTheme} from '../../../customHook/useTheme';
import {userPost,userPosts} from '../../../store/types';
import { useInfiniteQuery } from "react-query";
import Services from '../../../store/ApiService';
import Postholder from '../../../compoents/Posts/Postholder';
import PostCreator from '../../../compoents/Posts/PostCreator';
import Followholder from '../../../compoents/AccountCard/Followholder';
import SearchCard from '../../../compoents/AccountCard/SearchCard';
import Loading from '../../../compoents/Loading';
import {useQueryClient} from 'react-query';

const {SocialService } = Services;

type typeOfFilter = 'MainRandom' | 'Post' | 'Replies' | 'Likes' |'Reply'|'Following'|'Follower'|'LikedUser'|'Account'|'Hashtag' | 'PostWithTags'

interface TypeOfValuesPostsProps {
  typeOfFilter: typeOfFilter;
  username?: string;
  bno?: number;
  rno?: number;
  value?: string|null;
  filter?: 'account' | 'hashTag';
}

function TypeOfValuesPosts({typeOfFilter,username,bno,rno,filter,value}:TypeOfValuesPostsProps) {

  const queryClient = useQueryClient();
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
          else if(typeOfFilter === 'LikedUser'){
            const value = {bno,username}
            const res = await SocialService.likedUserFetch(value,pageParam)
            return res.data;
          }
          else if(typeOfFilter === 'Account' ||
            typeOfFilter === 'Hashtag'
          ){
            console.log('ss',value,typeOfFilter)
            if(typeOfFilter === 'Account' && value){
              const res = await SocialService.searchUserAccount(value,pageParam)
              return res.data
            }else if(typeOfFilter === 'Hashtag' && value){
              console.log('해시태그 실행')
              const res = await SocialService.searchHashTag(value,pageParam)
              return res.data
            }
            else{
              console.log('ss?')
              return
            }
          }
          else if(typeOfFilter === 'PostWithTags' && value){
            const res = await SocialService.fetchPostWithTags(value,pageParam)
            return res.data
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
          typeOfFilter === 'Reply' 
          ? ['fetchPosts', 'Reply', bno] // 'Reply'라면 bno를 포함
          :      
          typeOfFilter === 'Post' ||
          typeOfFilter === 'Replies' ||
          typeOfFilter === 'Likes'?
          ['fetchPosts',typeOfFilter,username,]:
          typeOfFilter === 'Account'|| typeOfFilter === 'Hashtag'?
          [typeOfFilter,'',value,]:    
          ['fetchPosts', typeOfFilter],    // 다른 경우는
          queryFn,
          {
            staleTime: Infinity,
            
            getNextPageParam: (lastPage, allPages) => {
              const fetchedData = Array.isArray(lastPage?.body) ? lastPage.body : [];
              console.log(fetchedData)
              if (fetchedData.length <=7) {
                return undefined;
              }
              return allPages.length; // 다음 페이지 번호
            },
            onError: (error: AxiosError) => {
              console.log(error.response || 'fetch post 실패');
            },
            onSuccess: (data) => {
              console.log('success',typeOfFilter,data)
              // 개별 데이터 캐싱
              // data.pages.forEach((page: any) => {
              //   page.body.forEach((post: any) => {
              //     const ID = post.bno ? post.bno : post.rno;
              //     queryClient.setQueryData([post.typeOfPost, ID], post);
              //     console.log([post.typeOfPost, ID], post,typeof(ID))
              //   });
              // });
            },
          }
        );


        const posts = data?.pages.flatMap((page) =>
          Array.isArray(page?.body) ? page.body : []
        ) || [];
        
        
        // const enrichedPosts = posts.map((post) => {
     
        //   const ID = post.bno ? post.bno : post.rno;
        //   console.log(queryClient.getQueryData([post.typeOfPost, ID]) || post)
        //   return queryClient.getQueryData([post.typeOfPost, ID]) || post;
        // });

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
 

      
        
      useEffect(() => {
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

{typeOfFilter === 'Following' ||
  typeOfFilter === 'Follower' ||
  typeOfFilter === 'LikedUser' ? (
    <Followholder isDark={isDark} accountInfo={posts} />
  ) :typeOfFilter === 'Account' ? (
    <SearchCard type={'Account'}  info={posts} isDark={isDark}/>
  ) : typeOfFilter === 'Hashtag'?
    <SearchCard type={'HashTag'} info={posts} isDark={isDark}/>:
  (
    <Postholder isDark={isDark} fetchedPosts={posts} />
  )}
        
          
          
     {isFetchingNextPage ? (
      <div className='p-3'>
      <Loading></Loading>
    </div>
      ) : hasNextPage ? (
        <div
          ref={observerTarget}
        />
      ) : (
        <div className='p-3'>
        <p>더 이상 정보가 없습니다.</p>
        </div>
      )}
            </>
          );
  }
    
export default TypeOfValuesPosts;