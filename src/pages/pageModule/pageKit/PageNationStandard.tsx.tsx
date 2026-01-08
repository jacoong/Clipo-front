import {useEffect,useState,useRef,useCallback} from 'react';
import Services from '../../../store/ApiService';
import Postholder from '../../../compoents/Posts/Postholder';
import PostholderOfLoadMore from '../../../compoents/Posts/PostholderOfLoadMore';
import Loading from '../../../compoents/Loading';
import { usePostsPagination } from '../../../customHook/usePagenation';
import ActivityItemMap from '../ActivityModule/ActivityItemMap';
import { useTheme } from '../../../customHook/useTheme';
import Followholder from '../../../compoents/AccountCard/Followholder';
import { useQueryClient } from 'react-query';
import { MdArrowDownward } from 'react-icons/md';
import { COLOR } from '../../../store/ThemeColor';
import { Bg_color_Type_1, Border_color_Type, Font_color_Type_2 } from '../../../store/ColorAdjustion';

const {SocialService } = Services;

type typeOfFilter =
  | 'Activity'|'NestRe'|'MainRandom'
  | 'Post' | 'Replies' | 'Likes' |'Reply'|'BiPagenation'
  | 'Following'|'Follower'|'LikedUser'
  | 'Account'|'Hashtag' | 'PostWithTags' | 'FollowingPost' |'Saved'

interface Props {
    typeOfFilter: typeOfFilter;
    username?: string;
    bno?: number;
    rno?: number;
    value?: string|null;
    numberOfComment?: number;
    initialPage?: number;
    pagenationPage?: 'infiniteScroll' | 'loadMore' | 'pageNumbers';
    emptyStateComponent?: React.ReactNode;
  }

  export default function PageNationStandard({
    typeOfFilter,
    username,
    bno,
    rno,
    value,
    numberOfComment = 0,
    initialPage = 0,
    pagenationPage = 'infiniteScroll',
    emptyStateComponent,
  }: Props) {
  console.log('PageNationStandard props received:', {
    typeOfFilter,
    pagenationPage,
    numberOfComment,
    bno,
    rno
  });

 
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
    pageSize:  10,
    enabled: true,
    initialPage
    });
  
    const { isDark } = useTheme();
  
  // posts 결정 로직
  const [posts, setPosts] = useState<any[] | null>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pullStartYRef = useRef<number | null>(null);
  const pullThreshold = 80;


// data 변경 시 posts 업데이트
useEffect(() => {
  if(data){
    console.log('data:', data);
    const dataArray = data?.pages.flatMap(page => page.body.data);
    setPosts(dataArray);
  }
}, [data]);

    // infinite-scroll 용 intersection observer
    const observerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const onIntersect = useCallback(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      [hasNextPage, isFetchingNextPage, fetchNextPage]
    );






    useEffect(() => {
      if (pagenationPage !== 'infiniteScroll') return;
      const obs = new IntersectionObserver(onIntersect, { threshold: 0.1 });
      if (observerRef.current) obs.observe(observerRef.current);
      return () => obs.disconnect();
    }, [onIntersect, pagenationPage]);

    const isAtTop = () => {
      const node = containerRef.current;
      if (node && node.scrollHeight > node.clientHeight) {
        return node.scrollTop <= 0;
      }
      return window.scrollY <= 0;
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;
      if (!isAtTop()) return;
      pullStartYRef.current = event.clientY;
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (pullStartYRef.current === null) return;
      const delta = event.clientY - pullStartYRef.current;
      if (delta <= 0) {
        setPullDistance(0);
        return;
      }
      if (!isPulling) {
        setIsPulling(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      setPullDistance(Math.min(delta, 140));
    };

    const finishPull = async () => {
      if (pullDistance >= pullThreshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await refetch();
        } finally {
          setIsRefreshing(false);
        }
      }
      setPullDistance(0);
    };

    const handlePointerUp = async (event: React.PointerEvent<HTMLDivElement>) => {
      if (pullStartYRef.current === null) return;
      pullStartYRef.current = null;
      if (isPulling) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setIsPulling(false);
      await finishPull();
    };

    const handlePointerCancel = async () => {
      if (pullStartYRef.current === null) return;
      pullStartYRef.current = null;
      setIsPulling(false);
      await finishPull();
    };
  
    return (
    <div
      ref={containerRef}
      className='w-full h-full'
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
        {(pullDistance > 0 || isRefreshing) && (
          <div
            className={`flex items-center justify-center border-b ${Border_color_Type(isDark)}`}
            style={{
              height: pullDistance || 56,
              transition: isPulling ? 'none' : 'height 200ms ease',
            }}
          >
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${Bg_color_Type_1(isDark)} ${Font_color_Type_2(isDark)}`}
              style={{
                opacity: isRefreshing ? 1 : Math.min(1, pullDistance / pullThreshold),
                transform: `translateY(${Math.min(pullDistance / 6, 8)}px)`,
                transition: isPulling ? 'none' : 'opacity 200ms ease, transform 200ms ease',
              }}
            >
              {isRefreshing ? (
                <span
                  className="w-4 h-4 border-2 border-b-transparent rounded-full inline-block box-border animate-spin"
                  style={{ borderColor: COLOR.themeColor, borderBottomColor: 'transparent' }}
                ></span>
              ) : (
                <MdArrowDownward
                  size={18}
                  style={{
                    transform: pullDistance >= pullThreshold ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms ease',
                  }}
                />
              )}
              <span className="text-sm">
                {isRefreshing ? '새로고침 중...' : pullDistance >= pullThreshold ? '놓으면 새로고침' : '아래로 당겨 새로고침'}
              </span>
            </div>
          </div>
        )}
        {/* Empty State */}
        {posts && posts.length === 0 && emptyStateComponent ? (
          emptyStateComponent
        ) : (
          /* Post 목록 */
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
  

      {/* infinite scroll observer */}
      {!isFetchingNextPage && hasNextPage && pagenationPage === 'infiniteScroll' && (
            <div ref={observerRef} style={{ height: 1 }} />
      )}
      </div>
    );
  }
