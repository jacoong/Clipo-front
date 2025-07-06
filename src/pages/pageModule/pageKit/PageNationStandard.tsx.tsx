import {useContext,useEffect,useState,ReactNode,useRef,useCallback} from 'react';
import Services from '../../../store/ApiService';
import Postholder from '../../../compoents/Posts/Postholder';
import Loading from '../../../compoents/Loading';
import { usePostsPagination } from '../../../customHook/usePagenation';
import SearchCard from '../../../compoents/AccountCard/SearchCard';
import ActivityItemMap from '../ActivityModule/ActivityItemMap';
import { useTheme } from '../../../customHook/useTheme';
import AccountItem from '../../../compoents/AccountCard/AccountItem';
import Followholder from '../../../compoents/AccountCard/Followholder';
const {SocialService } = Services;

type typeOfFilter = 'Activity'|'NestRe'|'MainRandom' | 'Post' | 'Replies' | 'Likes' |'Reply'|'Following'|'Follower'|'LikedUser'|'Account'|'Hashtag' | 'PostWithTags' | 'FollowingPost'

interface Props {
    typeOfFilter: typeOfFilter;
    username?: string;
    bno?: number;
    rno?: number;
    value?: string|null;
    // "몇 번째 댓글"로 페이지 점프할지 계산한 값
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
    const { isDark } = useTheme();
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



        {
          typeOfFilter === 'Activity' ? (
            <ActivityItemMap activityValues={posts} />
          ) : typeOfFilter === 'LikedUser' ? (
            <Followholder preventEditProfile={true} isDark={isDark} accountInfo={posts} />
          ) : (
            <Postholder isDark={isDark} fetchedPosts={posts} />
          )
        }
        {/* 로딩 중 */}
        {isFetchingNextPage && <Loading />}
  
        {/* 다음/이전/버튼 제어 */}
        {pagenationPage === 'loadMore' && !hasFetchedOnce && (
          numberOfComment - posts.length > 0 ? (
            <div onClick={hasGetMoreFetch}>
              더 보기 ({numberOfComment - posts.length})
            </div>
          ) : (
            <p>모든 댓글을 불러왔습니다.</p>
          )
        )}
      
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
