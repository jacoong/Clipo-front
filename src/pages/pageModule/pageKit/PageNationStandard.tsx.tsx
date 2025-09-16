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
  console.log('PageNationStandard props received:', {
    typeOfFilter,
    pagenationPage,
    numberOfComment,
    bno,
    rno
  });

  const app = [
    {
        "bno": 40,
        "rno": 75,
        "parentRno": 73,
        "typeOfPost": "nestRe",
        "email": "asdf@gmail.com",
        "nickName": "sef23242",
        "profilePicture": "default_3",
        "commentImage": null,
        "numberOfLike": 0,
        "numberOfComments": 0,
        "contents": "ㄹ\r\n",
        "regDate": "2025-09-02T16:36:54.848336",
        "isLike": false,
        "mentions": []
    },
    {
        "bno": 40,
        "rno": 76,
        "parentRno": 73,
        "typeOfPost": "nestRe",
        "email": "codingtogethers@gmail.com",
        "nickName": "qqww",
        "profilePicture": "default_3",
        "commentImage": null,
        "numberOfLike": 0,
        "numberOfComments": 0,
        "contents": "111",
        "regDate": "2025-09-02T16:50:39.872437",
        "isLike": false,
        "mentions": []
    },
    {
        "bno": 40,
        "rno": 89,
        "parentRno": 73,
        "typeOfPost": "nestRe",
        "email": "asdf@gmail.com",
        "nickName": "sef23242",
        "profilePicture": "default_3",
        "commentImage": null,
        "numberOfLike": 0,
        "numberOfComments": 0,
        "contents": "ㅁㅈㅇㅁㅈ",
        "regDate": "2025-09-03T01:24:57.511984",
        "isLike": false,
        "mentions": []
    },
    {
        "bno": 40,
        "rno": 90,
        "parentRno": 73,
        "typeOfPost": "nestRe",
        "email": "asdf@gmail.com",
        "nickName": "sef23242",
        "profilePicture": "default_3",
        "commentImage": null,
        "numberOfLike": 0,
        "numberOfComments": 0,
        "contents": "ㅁㅈㅇㅁㅈ",
        "regDate": "2025-09-03T01:24:59.560787",
        "isLike": false,
        "mentions": []
    },
    {
        "bno": 40,
        "rno": 91,
        "parentRno": 73,
        "typeOfPost": "nestRe",
        "email": "asdf@gmail.com",
        "nickName": "sef23242",
        "profilePicture": "default_3",
        "commentImage": null,
        "numberOfLike": 0,
        "numberOfComments": 0,
        "contents": "ㅁㅈㅇㅁㅈ",
        "regDate": "2025-09-03T01:25:01.742339",
        "isLike": false,
        "mentions": []
    },
    {
        "bno": 40,
        "rno": 92,
        "parentRno": 73,
        "typeOfPost": "nestRe",
        "email": "asdf@gmail.com",
        "nickName": "sef23242",
        "profilePicture": "default_3",
        "commentImage": null,
        "numberOfLike": 0,
        "numberOfComments": 0,
        "contents": "ㅁㅈㅇㅁㅈ",
        "regDate": "2025-09-03T01:25:04.467815",
        "isLike": false,
        "mentions": []
    },
    {
        "bno": 40,
        "rno": 93,
        "parentRno": 73,
        "typeOfPost": "nestRe",
        "email": "asdf@gmail.com",
        "nickName": "sef23242",
        "profilePicture": "default_3",
        "commentImage": null,
        "numberOfLike": 0,
        "numberOfComments": 0,
        "contents": "ㄴㄷㄹㄷㄴ",
        "regDate": "2025-09-03T01:37:07.511686",
        "isLike": false,
        "mentions": []
    },
    {
        "bno": 40,
        "rno": 94,
        "parentRno": 73,
        "typeOfPost": "nestRe",
        "email": "asdf@gmail.com",
        "nickName": "sef23242",
        "profilePicture": "default_3",
        "commentImage": null,
        "numberOfLike": 0,
        "numberOfComments": 0,
        "contents": "11",
        "regDate": "2025-09-03T01:37:09.587861",
        "isLike": false,
        "mentions": []
    },
    {
        "bno": 40,
        "rno": 95,
        "parentRno": 73,
        "typeOfPost": "nestRe",
        "email": "asdf@gmail.com",
        "nickName": "sef23242",
        "profilePicture": "default_3",
        "commentImage": null,
        "numberOfLike": 0,
        "numberOfComments": 0,
        "contents": "121",
        "regDate": "2025-09-03T01:37:11.653052",
        "isLike": false,
        "mentions": []
    },
    {
        "bno": 40,
        "rno": 96,
        "parentRno": 73,
        "typeOfPost": "nestRe",
        "email": "asdf@gmail.com",
        "nickName": "sef23242",
        "profilePicture": "default_3",
        "commentImage": null,
        "numberOfLike": 0,
        "numberOfComments": 0,
        "contents": "12312",
        "regDate": "2025-09-03T01:37:13.484972",
        "isLike": false,
        "mentions": []
    }
]
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
    pageSize:  10,
    enabled: true
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
        {/* Post 목록 */}
      {(
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
