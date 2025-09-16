import React, { useCallback } from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';
import { Border_color_Type } from '../../store/ColorAdjustion';
import PostItemSkeleton from '../skeleton/PostItemSkeleton';

interface PostholderOfLoadMoreProps {
  fetchedPosts: userPost[];
  isDark: boolean;
  numberOfComments: number;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isCollapsed: boolean;
  onExpand: () => void;
  // 💡 react-query 최신 버전을 위해 'pending' 추가
  status: 'idle' | 'pending' | 'loading' | 'success' | 'error';
  isFetchingNextPage: boolean;
}

const PostholderOfLoadMore = ({
  fetchedPosts,
  isDark,
  numberOfComments,
  onLoadMore,
  hasNextPage,
  isCollapsed,
  onExpand,
  status,
  isFetchingNextPage,
}: PostholderOfLoadMoreProps) => {
  
  // 💡 1. 이벤트 핸들러를 useCallback으로 최적화합니다.
  // 이벤트 버블링을 막고 부모로부터 받은 함수를 호출합니다.
  const handleLoadMoreClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onLoadMore();
  }, [onLoadMore]);

  const handleExpandClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onExpand();
  }, [onExpand]);

  // 💡 2. 버튼 렌더링 로직을 JSX 안으로 이동시켜 가독성을 높입니다.
  const renderButton = () => {
    if (isCollapsed) {
      return (
        <div onClick={handleExpandClick} className="cursor-pointer text-blue-500 hover:text-blue-700 text-center py-2">
          다시 펼치기
        </div>
      );
    }

    if (status === 'idle') {
      return (
        <div onClick={handleLoadMoreClick} className="cursor-pointer text-blue-500 hover:text-blue-700 text-center py-2">
          댓글 {numberOfComments}개 보기
        </div>
      );
    }

    if (isFetchingNextPage) {
      return <div className="text-gray-500 text-center py-2">댓글을 불러오는 중...</div>;
    }

    if (hasNextPage) {
      const remainingCount = numberOfComments - fetchedPosts.length;
      return (
        <div onClick={handleLoadMoreClick} className="cursor-pointer text-blue-500 hover:text-blue-700 text-center py-2">
          더 보기 ({remainingCount > 0 ? remainingCount : 0})
        </div>
      );
    }

    // 데이터가 있고, 다음 페이지가 없을 때 (모두 로드)
    if (!hasNextPage && fetchedPosts.length > 0) {
      return (
        <div onClick={handleExpandClick} className="text-gray-500 text-center py-2 cursor-pointer">
          <p>댓글 접기</p>
        </div>
      );
    }

    return null; // 그 외의 경우 버튼 숨김
  };

  // 💡 3. 콘텐츠 렌더링 로직을 분리하여 명확하게 만듭니다.
  const renderContent = () => {
    if (isCollapsed) {
      return null; // 접혔을 때는 아무것도 보여주지 않음
    }

    // 최초 로딩 상태일 때
    if (status === 'loading' || status === 'pending') {
      return (
        <>
          <PostItemSkeleton isDark={isDark} />
          <PostItemSkeleton isDark={isDark} />
          <PostItemSkeleton isDark={isDark} />
        </>
      );
    }

    // 로딩 성공 후 데이터가 있을 때
    if (status === 'success' && fetchedPosts.length > 0) {
      return (
        <div>
          {fetchedPosts.map((post) => (
            <div key={post.rno}>
              <div className={`${post.typeOfPost === 'nestRe' ? 'py-2' : 'border-b'} ${Border_color_Type(isDark)}`}>
                <PostItem isDark={isDark} postInfo={post} />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null; // 그 외의 경우 (e.g., 로딩 성공 후 데이터가 없을 때)
  };

  return (
    <div className="w-24">
      <div className="mb-4">
        {renderButton()}
      </div>
      {renderContent()}
    </div>
  );
};

export default PostholderOfLoadMore;