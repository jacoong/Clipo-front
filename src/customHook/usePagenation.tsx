import { useInfiniteQuery,UseInfiniteQueryResult } from 'react-query';
import { AxiosError } from 'axios';
import Services from '../store/ApiService';
import {userPost,userPosts} from '../store/types';

type TypeOfFilter = 'BiPagenation'|'Activity'|'NestRe'|'MainRandom'|'Post'|'Replies'|'Likes'|'Reply'|'Following'|'Follower'|'LikedUser'|'Account'|'Hashtag'|'PostWithTags'|'FollowingPost';

interface UsePostsPaginationProps {
  typeOfFilter: TypeOfFilter;
  username?: string;
  bno?: number;
  rno?: number;
  value?: string | null;
  pageSize?: number;
  initialPage?: number;
  enabled?:boolean;
}

interface PostResponseBodyType {
  data:any;
  page:number;
  hasNext:boolean;
  hasPrev:boolean;
}

interface PostsResponse {
    body: PostResponseBodyType;
  }


export function usePostsPagination({
  typeOfFilter,
  username,
  bno,
  rno,
  value,
  pageSize = 10,
  initialPage = 0,
  enabled = false
}: UsePostsPaginationProps): UseInfiniteQueryResult<PostsResponse, AxiosError> {
  const queryFn = async ({
    pageParam,
  }: {
    pageParam?: number;
  }): Promise<PostsResponse> => {
    // pageParam이 없으면 initialPage 사용
    const page = pageParam ?? initialPage;
    const s = Services.SocialService;

    switch (typeOfFilter) {
      case 'MainRandom':
        return (await s.fetchPosts(page)).data;
      case 'Post':
      case 'Replies':
      case 'Likes':
        return (
          await s.fetchUserPosts({ username, typeOfFilter, pages: page })
        ).data;
      case 'BiPagenation':
          return (await s.fetchedReply(bno!, page)).data;
      case 'Reply':
        return (await s.fetchedReply(bno!, page)).data;
      case 'NestRe':
        return (await s.fetchedNestRe(rno!, page)).data;
      case 'Following':
      case 'Follower':
        return (
          await s.fetchedFollowingFollower({ username, typeOfFilter }, page)
        ).data;
      case 'LikedUser':
        return (await s.likedUserFetch({ bno, username }, page)).data;
      case 'Account':
        return (await s.searchUserAccount(value!, page)).data;
      case 'Hashtag':
        return (await s.searchHashTag(value!, page)).data;
      case 'PostWithTags':
        console.log(value,page)
        return (await s.fetchPostWithTags(value!, page)).data;
      case 'Activity':
        return (await s.fetchActivity(page)).data;
      case 'FollowingPost':
        return (await s.fetchFollowPost(page)).data;
      default:
        throw new Error(`Unknown filter: ${typeOfFilter}`);
    }
  };

  let queryKey: readonly unknown[];

  if (typeOfFilter === 'Reply') {
    queryKey = ['fetchPosts', 'Reply', bno];
  } else if (typeOfFilter === 'NestRe') {
    queryKey = ['fetchPosts', 'NestRe', rno];
  } else if (['Post', 'Replies', 'Likes'].includes(typeOfFilter)) {
    queryKey = ['fetchPosts', typeOfFilter, username];
  } else if (['Account', 'Hashtag'].includes(typeOfFilter)) {
    queryKey = ['fetchPosts', typeOfFilter, `filterValue:${value}`];
  } 
  else if(typeOfFilter === 'PostWithTags'){
    queryKey = ['PostWithTags', `filterValue:${value}`];
  }
    else {
    queryKey = ['fetchPosts', typeOfFilter];
  }

  return useInfiniteQuery<PostsResponse, AxiosError>(
    queryKey,
    queryFn,
    {
      enabled:enabled,
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false, // 항상 false로 설정하여 초기 자동 fetch 방지
      getNextPageParam: (lastPage, allPages) => {
        console.log(lastPage.body.page +1,'lastPage')
        return lastPage.body.hasNext ? lastPage.body.page +1 : undefined; // 1 1
      },
      getPreviousPageParam: (firstPage, allPages) => {
        const prevPage = firstPage.body.page -1
        return firstPage.body.hasPrev ? prevPage : undefined
      },
    }
  );
}
