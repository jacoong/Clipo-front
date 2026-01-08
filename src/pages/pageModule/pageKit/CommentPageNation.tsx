import {useEffect,useState,useMemo} from 'react';
import Postholder from '../../../compoents/Posts/Postholder';
import { usePostsPagination } from '../../../customHook/usePagenation';
import PostholderOfLoadMore from '../../../compoents/Posts/PostholderOfLoadMore';
import TransitionDiv from 'src/compoents/TransitionDiv';
import { Border_color_Type } from 'src/store/ColorAdjustion';


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
          {hasPreviousPage &&
          <TransitionDiv isDark={isDark} className={`border-b ${Border_color_Type(isDark)} p-2  text-center`}>
          <div onClick={() => fetchPreviousPage()}>이전 댓글 불러오기</div>
          </TransitionDiv>
          }
          
          {/* 로딩 중일 때 처리 */}
          {status === 'loading' && <div>로딩 중...</div>}
          
          {/* 성공 시 데이터 렌더링 */}
          {status === 'success' && (
            <Postholder 
              isDark={isDark} 
              fetchedPosts={allPosts} 
              scrollTargetId={targetReplyId}
              targetReplyId={targetReplyId}
              targetNestId={targetNestId}
              nestInitialPage={nestInitialPage}
            />
          )}
          
          {/* 다음 페이지 버튼 */}
          {hasNextPage && (
          <TransitionDiv isDark={isDark} className={`border-b ${Border_color_Type(isDark)} p-2  text-center`}>
          <div onClick={() => fetchNextPage()}>  {isFetchingNextPage ? '로딩 중...' : '다음 댓글 불러오기'}</div>
          </TransitionDiv>
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
