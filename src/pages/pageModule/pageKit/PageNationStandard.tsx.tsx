import {useContext,useEffect,useState,ReactNode,useRef,useCallback} from 'react';
import Services from '../../../store/ApiService';
import Postholder from '../../../compoents/Posts/Postholder';
import Loading from '../../../compoents/Loading';
import { usePostsPagination } from '../../../customHook/usePagenation';
import SearchCard from '../../../compoents/AccountCard/SearchCard';

const {SocialService } = Services;

type typeOfFilter = 'Activity'|'NestRe'|'MainRandom' | 'Post' | 'Replies' | 'Likes' |'Reply'|'Following'|'Follower'|'LikedUser'|'Account'|'Hashtag' | 'PostWithTags' | 'FollowingPost'

interface Props {
    typeOfFilter: typeOfFilter;
    username?: string;
    bno?: number;
    rno?: number;
    value?: string|null;
    // “몇 번째 댓글”로 페이지 점프할지 계산한 값
    numberOfComment?: number;
    // pagination 모드: infiniteScroll | loadMore | pageNumbers
    pagenationPage?: 'infiniteScroll' | 'loadMore' | 'pageNumbers';
  }

  export default function PageNationStandard({
    typeOfFilter,
    username,
    bno,
    rno,
    value,
    numberOfComment = 0,
    pagenationPage = 'infiniteScroll',
  }: Props) {
    // 댓글 인덱스로부터 초기 페이지 계산 (예: 8번째 댓글이면 8/10 → 0 기반 0페이지)

    const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      fetchPreviousPage,
    } = usePostsPagination({
      typeOfFilter,
      username,
      bno,
      rno,
      value,
      pageSize: 10,
      enabled: pagenationPage !== 'loadMore'
    });
  
    // flatMap 해서 전체 리스트 뽑아오기
    const posts = data?.pages.flatMap(page => page.body.data) ?? [];
    const [hasFetchedOnce,setHasFetchedOnce] = useState<boolean>(false);
    // infinite-scroll 용 intersection observer
    const observerRef = useRef<HTMLDivElement>(null);
    const onIntersect = useCallback(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    const hasGetMoreFetch = async() =>{
        if (!hasFetchedOnce) setHasFetchedOnce(true);
        await fetchNextPage()
    };

    useEffect(() => {
        console.log(numberOfComment,'numberOfComment')
      if (pagenationPage !== 'infiniteScroll') return;
      const obs = new IntersectionObserver(onIntersect, { threshold: 0.1 });
      if (observerRef.current) obs.observe(observerRef.current);
      return () => obs.disconnect();
    }, [onIntersect, pagenationPage]);
  
    return (
      <div>

        {/* Post 목록 */}



        {typeOfFilter === 'LikedUser' ||typeOfFilter === 'Following'  ||typeOfFilter === 'Follower' ?
        <SearchCard isDark={true} info={posts} type={'Account'}/>     //유저 팔로우 느낌
        :
        <Postholder isDark={true} fetchedPosts={posts} />  //댓글 게시글 느낌
         }
        {/* 로딩 중 */}
        {isFetchingNextPage && <Loading />}
  
        {/* 다음/이전/버튼 제어 */}
        {pagenationPage === 'loadMore' && !hasFetchedOnce?
         <button onClick={() => hasGetMoreFetch()}>더 보기{(numberOfComment - posts.length)}</button>:
         null
        }
        {!isFetchingNextPage && hasNextPage &&  (
          pagenationPage === 'infiniteScroll' ? (
            <div ref={observerRef} style={{ height: 1 }} />
          ) : pagenationPage === 'loadMore' ? (
            <button onClick={() => hasGetMoreFetch()}>더 보기{(numberOfComment - posts.length)}</button>
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
