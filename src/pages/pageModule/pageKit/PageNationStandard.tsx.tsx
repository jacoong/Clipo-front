import {useEffect,useState,useRef,useCallback} from 'react';
import Services from '../../../store/ApiService';
import Postholder from '../../../compoents/Posts/Postholder';
import Loading from '../../../compoents/Loading';
import { usePostsPagination } from '../../../customHook/usePagenation';
import ActivityItemMap from '../ActivityModule/ActivityItemMap';
import { useTheme } from '../../../customHook/useTheme';
import Followholder from '../../../compoents/AccountCard/Followholder';
import { useQueryClient } from 'react-query';

const {SocialService } = Services;

type typeOfFilter =
  | 'Activity'|'NestRe'|'MainRandom'
  | 'Post' | 'Replies' | 'Likes' |'Reply'
  | 'Following'|'Follower'|'LikedUser'
  | 'Account'|'Hashtag' | 'PostWithTags' | 'FollowingPost'

interface Props {
  typeOfFilter: typeOfFilter;
  username?: string;
  bno?: number;
  rno?: number;
  value?: string|null;
  numberOfComment?: number;
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
  const queryClient = useQueryClient();

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
    bno,
    rno,
    value,
    pageSize: pagenationPage === 'loadMore' ? 5 : 10,
    enabled: pagenationPage === 'loadMore' ? false : true, // 항상 enabled로 설정
  });

  const { isDark } = useTheme();
  
  // loadMore 모드일 때는 useState로 데이터 관리
  const [localPosts, setLocalPosts] = useState<any[]>([]);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // posts 결정 로직
  const posts = pagenationPage === 'loadMore' 
    ? localPosts 
    : data?.pages.flatMap(page => page.body.data) ?? null;

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

  // loadMore 버튼 로직
  const hasGetMoreFetch = async () => {
    if (!hasFetchedOnce) {
      // 첫 번째 호출
      const result = await refetch();
      if (result.data) {
        const firstPageData = result.data.pages[0].body.data;
        setLocalPosts(firstPageData);
        setHasFetchedOnce(true);
      }
    } else {
      // 이후 호출
      await fetchNextPage();
      // fetchNextPage 후에 data가 업데이트되면 localPosts도 업데이트
      if (data) {
        const allData = data.pages.flatMap(page => page.body.data);
        setLocalPosts(allData);
      }
    }
  };

  const handleExpand = () => setIsCollapsed(false);

  // data가 변경될 때마다 localPosts 업데이트 (loadMore 모드에서)
  useEffect(() => {
    if (pagenationPage === 'loadMore' && data && hasFetchedOnce) {
      const allData = data.pages.flatMap(page => page.body.data);
      setLocalPosts(allData);
    }
  }, [data, pagenationPage, hasFetchedOnce]);

  useEffect(() => {
    console.log('data', data);
  }, [data]);

  useEffect(() => {
    if (pagenationPage !== 'infiniteScroll') return;
    const obs = new IntersectionObserver(onIntersect, { threshold: 0.1 });
    if (observerRef.current) obs.observe(observerRef.current);
    return () => obs.disconnect();
  }, [onIntersect, pagenationPage]);

  return (
    <div className='w-full h-full'>
      {/* Post 목록 */}
      {!isCollapsed && (
        typeOfFilter === 'Activity' ? (
          <ActivityItemMap activityValues={posts} />
        ) : typeOfFilter === 'LikedUser' ? (
          <Followholder preventEditProfile={true} isDark={isDark} accountInfo={posts} />
        ) : (
          <Postholder isDark={isDark} fetchedPosts={posts} />
        )
      )}

      {/* 로딩 중 */}
      {isFetchingNextPage && <Loading />}

      {/* loadMore 모드에서 버튼들 */}
      {pagenationPage === 'loadMore' && (
        <>
          {/* 아직 한 번도 fetch 안 한 경우 */}
          {!hasFetchedOnce && (
            <div
              className='cursor-pointer text-blue-500 hover:text-blue-700'
              onClick={hasGetMoreFetch}
            >
                더 보기 ({numberOfComment})
            </div>
          )}

          {/* 한 번 이상 fetch 했을 때 */}
          {hasFetchedOnce && !isCollapsed && hasNextPage && (
            <div
              className='cursor-pointer text-blue-500 hover:text-blue-700'
              onClick={hasGetMoreFetch}
            >
              더 보기 ({numberOfComment - (posts?.length || 0)})
            </div>
          )}

          {/* 접혔을 때 */}
          {isCollapsed && (
            <div
              className='cursor-pointer text-blue-500 hover:text-blue-700'
              onClick={handleExpand}
            >
              다시 펼치기
            </div>
          )}

          {/* 더 이상 불러올 데이터가 없을 때 */}
          {hasFetchedOnce && !hasNextPage && posts && posts.length > 0 && !isCollapsed && (
            <div className='text-gray-500'>
              <p>모든 댓글을 불러왔습니다.</p>
            </div>
          )}
        </>
      )}

      {/* infinite scroll observer */}
      {!isFetchingNextPage && hasNextPage && pagenationPage === 'infiniteScroll' && (
        <div ref={observerRef} style={{ height: 1 }} />
      )}
    </div>
  );
}
