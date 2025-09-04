import {useContext,useEffect,useState,ReactNode,useRef,useCallback} from 'react';
import Services from '../../../store/ApiService';
import Postholder from '../../../compoents/Posts/Postholder';
import Loading from '../../../compoents/Loading';
import { usePostsPagination } from '../../../customHook/usePagenation';
import PostItem from '../../../compoents/Posts/PostItem';
import SearchCard from '../../../compoents/AccountCard/SearchCard';
const {SocialService } = Services;

type typeOfFilter = 'Account'|'Hashtag'|'Following'|'Follower'

interface Props {
    isDark:boolean;
    typeOfFilter: typeOfFilter;
    username?: string;
    value?: string|null;
    pagenationPage?: 'infiniteScroll' | 'loadMore' | 'pageNumbers';
  }

  export default function SearchTagPagenation({
    typeOfFilter,
    isDark,
    username,
    value,
    pagenationPage = 'infiniteScroll',
  }: Props) {
    // 댓글 인덱스로부터 초기 페이지 계산 (예: 8번째 댓글이면 8/10 → 0 기반 0페이지)

    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      fetchPreviousPage,
      refetch,
    } = usePostsPagination({
      typeOfFilter,
      username,
      value,
      pageSize: 10,
      enabled: pagenationPage !== 'loadMore'
    });
    const observerRef = useRef<HTMLDivElement>(null);
    const onIntersect = useCallback(
        ([entry]: IntersectionObserverEntry[]) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
      );

    // flatMap 해서 전체 리스트 뽑아오기
    const posts = data?.pages.flatMap(page => page.body.data) ?? (pagenationPage === 'loadMore' ? [] : null);
    const [hasFetchedOnce,setHasFetchedOnce] = useState<boolean>(false);
    // infinite-scroll 용 intersection observer
   

      const hasGetMoreFetch = async () => {
        if (!hasFetchedOnce) {
          await refetch();        // 최초에는 refetch로 첫 페이지 가져오기
          setHasFetchedOnce(true);
        } else {
          await fetchNextPage();  // 그다음부터는 fetchNextPage로 다음 페이지 가져오기
        }
      };

    useEffect(() => {
      if (pagenationPage !== 'infiniteScroll') return;
      const obs = new IntersectionObserver(onIntersect, { threshold: 0.1 });
      if (observerRef.current) obs.observe(observerRef.current);
      return () => obs.disconnect();
    }, [onIntersect, pagenationPage]);

  
    return (
      <div>

        {/* Post 목록 */}

    

  
        <SearchCard isDark={isDark} info={posts} type={typeOfFilter === 'Hashtag' ? 'Hashtag' : 'Account'}
/>
  
        {/* 로딩 중 */}
        {isFetchingNextPage && <Loading />}
  
        {/* 다음/이전/버튼 제어 */}
        {pagenationPage === 'loadMore' ?
         <button onClick={() => hasGetMoreFetch()}>더 보기</button>:
         null
        }
        {!isFetchingNextPage && hasNextPage &&  (
          pagenationPage === 'infiniteScroll' ? (
            <div ref={observerRef} style={{ height: 1 }} />
          ) : pagenationPage === 'loadMore' ? (
            <button onClick={() => hasGetMoreFetch()}>더 보기</button>
          ) : (
            // <div>
            //   <button
            //     disabled={!hasPreviousPage}
            //     onClick={() => fetchPreviousPage()}
            //   >이전</button>
            //   <button
            //     disabled={!hasNextPage}
            //     onClick={() => fetchNextPage()}
            //   >다음</button>
            // </div>
            !hasNextPage && <p>더 이상 정보가 없습니다.</p>
          )
        )}
  
        {/* 더 불러올 게 없을 때 */}
        {/* {!hasNextPage && <p>더 이상 정보가 없습니다.</p>} */}
      </div>
    );
  }
