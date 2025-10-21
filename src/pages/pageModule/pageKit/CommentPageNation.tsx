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
    initialPage: number;
    numberOfComment: number;
    typeOfFilter: 'BiPagenation'|'NestRe';
  }

  export default function CommentPageNation({
    parentId,
    childId,
    isDark,
    initialPage = 0,
    typeOfFilter = 'BiPagenation',
    numberOfComment
  }: Props) {
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
      enabled: typeOfFilter === 'NestRe' ? false : true, // NestRe일 때는 처음에 비활성화
      typeOfFilter,
      bno:parentId,
      rno:childId,
      initialPage,
    });
  
    const allPosts = useMemo(() => {
      console.log(data?.pages,'data?.pages')
      console.log("useMemo is recalculating allPosts..."); // 변경이 감지되는지 확인용
      return data?.pages.flatMap(page => page.body.data) ?? [];
    }, [data?.pages]); // <--- 이 부분을 수정해주세요!

    const [isCollapsed, setIsCollapsed] = useState(false);
    const onExpand = () => setIsCollapsed(!isCollapsed);

  

   
    if (typeOfFilter === 'BiPagenation') {
      return (
        <div>
          {/* 이전 페이지 로딩 기능은 usePostsPagination에 구현되어 있어야 합니다. */}
          {/* <button disabled={!hasPreviousPage} onClick={() => fetchPreviousPage()}>이전 보기</button> */}
          
          {/* 로딩 중일 때 처리 */}
          {status === 'loading' && <div>로딩 중...</div>}
          
          {/* 성공 시 데이터 렌더링 */}
          {status === 'success' && <Postholder isDark={true} fetchedPosts={allPosts} />}
          
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
        hasNextPage={!!hasNextPage} // boolean 타입 보장
        isCollapsed={isCollapsed}
        onExpand={onExpand}
        status={status}
        isFetchingNextPage={isFetchingNextPage}
      />
    );
  }