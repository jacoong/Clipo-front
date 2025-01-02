
import React,{useState,ReactNode} from 'react';
import { useInfiniteQuery } from "react-query";
import { AxiosError } from 'axios';
import Postholder from './Postholder'; 
import {useTheme} from '../../customHook/useTheme';
import Service from '../../store/ApiService';
interface typeOfBnoRno {
    rno?:number;
    numberOfComment:number;
}
const PostNestRe = ({rno,numberOfComment}:typeOfBnoRno)=>{
    const { isDark } = useTheme();
    const [isInitialLoading, setIsInitialLoading] = useState(false); // 초기
    const {SocialService} = Service;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch
      } = useInfiniteQuery<any, AxiosError<{ message: string }>>(
        ['fetchedNestRe', rno],
        async({ pageParam = 0 }) =>
          {
            if (rno !== undefined) {
              const res = await SocialService.fetchedNestRe(rno, pageParam);
              console.log(res.data,'information!')
              return res.data
            }
            throw new Error('bno and rno must be defined');
          },
          {
          enabled:false, // Prevent automatic execution
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

      const handleFetchMore = async () => {
        if (hasNextPage && !isFetchingNextPage) {
          await fetchNextPage(); // 다음 페이지 로드
        }
      };

      const handleInitialLoad = async () => {
        setIsInitialLoading(true); // 초기 로드 상태 활성화
         refetch(); // 초기 데이터 로드
        setIsInitialLoading(false); // 초기 로드 상태 비활성화
      };

      
return (
  <div>
  {/* 초기 로드 */}
  {isInitialLoading ? (
    <div>더 불러오는 중...</div>
  ) : data === undefined ? (
    <button onClick={handleInitialLoad} className="cursor-pointer">
      답글 보기 ({numberOfComment}개)
    </button>
  ) : isFetchingNextPage ? (
    // 페이징 중
    <div>더 불러오는 중...</div>
  ) : hasNextPage ? (
    // 더 불러올 데이터가 있는 경우
    <button onClick={handleFetchMore} className="cursor-pointer">
      답글 더 보기 ({numberOfComment}개)
    </button>
  ) : (
    // 더 이상 데이터가 없는 경우
    <div>모든 댓글을 불러왔습니다.</div>
  )}

  {/* 답글 목록 렌더링 */}
  <Postholder isDark={isDark} fetchedPosts={posts} />
</div>
)
}

export default PostNestRe;