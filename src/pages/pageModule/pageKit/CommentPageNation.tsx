import {useContext,useEffect,useState,ReactNode,useRef,useCallback} from 'react';
import Services from '../../../store/ApiService';
import Postholder from '../../../compoents/Posts/Postholder';
import Loading from '../../../compoents/Loading';
import { usePostsPagination } from '../../../customHook/usePagenation';
import { userPost } from '../../../store/types';
const {SocialService } = Services;


interface Props {
    parentId:number;
    childId:number;
    initialPage: number;
    numberOfComment: number;
  }

  export default function CommentPageNation({
    parentId,
    childId,
    initialPage = 0,
    numberOfComment
  }: Props) {
    const {
      data,
      fetchNextPage,
      fetchPreviousPage,
      hasNextPage,
      hasPreviousPage,
      isFetchingNextPage
    } = usePostsPagination({
      typeOfFilter:'BiPagenation',
      bno:parentId,
      rno:childId,
      initialPage,
    });
  
  
    const posts = data?.pages.flatMap(page => page.body.data) ?? [];
    const loadedCount = posts.length;
    const nextRemainingCount = hasNextPage ? numberOfComment - loadedCount : 0;
    const prevRemainingCount = hasPreviousPage ? numberOfComment - loadedCount : 0;

    const prefetchCalledRef = useRef(false);

    useEffect(() => {
    if (!data || prefetchCalledRef.current) return;
    console.log('commentpagenation')
    prefetchCalledRef.current = true;
    // fetchNextPage();
    // fetchPreviousPage();
    scrollingPaging(posts);
    }, [data, hasNextPage, hasPreviousPage, fetchNextPage, fetchPreviousPage]);


    const scrollingPaging = (posts:userPost[])=>{
      if (!Array.isArray(posts) || posts.length === 0) return;
      const target = posts.find((item:userPost) => item.rno === parentId);
      if (target) {
        const element = document.getElementById(`rno-${parentId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    return (
      <div>
        {hasPreviousPage ?
         <button onClick={() => fetchPreviousPage()}>이전 보기</button>:
         null
        }
        <Postholder isDark={true} fetchedPosts={posts} />
        {hasNextPage ?
        <button onClick={() => fetchNextPage()}>다음 보기</button>: 
        <div>모든 댓글을 로드하였습니다.</div> 
        }
      </div>
    );
  }
