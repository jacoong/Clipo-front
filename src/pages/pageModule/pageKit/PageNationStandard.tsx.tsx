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
  
    return (
    <div className='w-full h-full'>
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
