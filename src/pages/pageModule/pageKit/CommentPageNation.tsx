import {useContext,useEffect,useState,ReactNode,useRef,useCallback,useMemo} from 'react';
import Services from '../../../store/ApiService';
import Postholder from '../../../compoents/Posts/Postholder';
import Loading from '../../../compoents/Loading';
import { usePostsPagination } from '../../../customHook/usePagenation';
import { userPost } from '../../../store/types';
import PostholderOfLoadMore from '../../../compoents/Posts/PostholderOfLoadMore';

const {SocialService } = Services;


interface Props {
    parentId:number;
    isDark:boolean;
    childId:number;
    initialPage?: number;
    numberOfComment: number;
    typeOfFilter: 'BiPagenation'|'NestRe';
    targetReplyId?: number;
    targetNestId?: number;
    nestInitialPage?: number;
    autoLoadNest?: boolean;
  }

  export default function CommentPageNation({
    parentId,
    childId,
    isDark,
    initialPage = 0,
    typeOfFilter = 'BiPagenation',
    numberOfComment,
    targetReplyId,
    targetNestId,
    nestInitialPage = 0,
    autoLoadNest = false
  }: Props) {
    const isNestRe = typeOfFilter === 'NestRe';
    const effectiveInitialPage = isNestRe ? nestInitialPage ?? initialPage : initialPage;
    const {
      data,
      fetchNextPage,
      fetchPreviousPage,
      hasNextPage,
      hasPreviousPage,
      isFetchingNextPage,
      refetch,
      status
    } = usePostsPagination({
      enabled: isNestRe ? autoLoadNest : true, // NestRe일 때는 처음에 비활성화
      typeOfFilter,
      bno:parentId,
      rno:childId,
      initialPage: effectiveInitialPage,
    });
  
    const allPosts = useMemo(() => {
      console.log(data?.pages,'data?.pages')
      console.log("useMemo is recalculating allPosts..."); // 변경이 감지되는지 확인용
      return data?.pages.flatMap(page => page.body.data) ?? [];
    }, [data?.pages]); // <--- 이 부분을 수정해주세요!

    const [isCollapsed, setIsCollapsed] = useState(false);
    useEffect(() => {
      if (autoLoadNest) {
        setIsCollapsed(false);
      }
    }, [autoLoadNest]);
    const onExpand = () => setIsCollapsed(!isCollapsed);

  

   
    if (typeOfFilter === 'BiPagenation') {
      return (
        <div>
          {/* 이전 페이지 로딩 기능은 usePostsPagination에 구현되어 있어야 합니다. */}
          {/* <button disabled={!hasPreviousPage} onClick={() => fetchPreviousPage()}>이전 보기</button> */}
          
          {/* 로딩 중일 때 처리 */}
          {status === 'loading' && <div>로딩 중...</div>}
          
          {/* 성공 시 데이터 렌더링 */}
          {status === 'success' && (
            <Postholder 
              isDark={true} 
              fetchedPosts={allPosts} 
              scrollTargetId={targetReplyId}
              targetReplyId={targetReplyId}
              targetNestId={targetNestId}
              nestInitialPage={nestInitialPage}
            />
          )}
          
          {/* 다음 페이지 버튼 */}
          {hasNextPage && (
            <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
              {isFetchingNextPage ? '로딩 중...' : '다음 보기'}
            </button>
          )}
  
          {/* 오류 처리 */}
          {status === 'error' && <div>오류가 발생했습니다.</div>}
        </div>
      );
    }
  
    // NestRe 타입 렌더링
    return (
      <PostholderOfLoadMore
        fetchedPosts={allPosts}
        isDark={isDark}
        numberOfComments={numberOfComment}
        onLoadMore={() => fetchNextPage()}
        onLoadPrev={() => fetchPreviousPage()}
        hasNextPage={!!hasNextPage} // boolean 타입 보장
        hasPrevPage={!!hasPreviousPage}
        isCollapsed={isCollapsed}
        onExpand={onExpand}
        status={status}
        isFetchingNextPage={isFetchingNextPage}
        scrollTargetId={targetNestId}
      />
    );
  }
