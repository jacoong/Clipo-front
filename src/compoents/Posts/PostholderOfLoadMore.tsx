import React, { useCallback } from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';
import { Border_color_Type, Font_color_Type_1, hover_color_Type } from '../../store/ColorAdjustion';
import PostItemSkeleton from '../skeleton/PostItemSkeleton';
import Loading from '../Loading';
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
        <div onClick={handleExpandClick} className={`inline-block cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 ${hover_color_Type(isDark)}`}>
          <span className={`inline-block  text-blue-600`}>
            다시 펼치기
          </span>
        </div>
      );
    }

    if (status === 'idle') {
      return (
        <div onClick={handleLoadMoreClick} className={`inline-block text-left cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 ${hover_color_Type(isDark)}`}>
            <span className={`inline-block ${Font_color_Type_1(isDark)}`}>
            댓글 {numberOfComments}개 보기
            </span>
        </div>
      );
    }

    if (isFetchingNextPage) {
      return <div className={`inline-block py-2 px-3 ${Font_color_Type_1(isDark)}`}>
        <Loading/>
        </div>;
    }

    if (hasNextPage) {
      const remainingCount = numberOfComments - fetchedPosts.length;
      return (
        <div onClick={handleLoadMoreClick} className={`inline-block cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 ${hover_color_Type(isDark)}`}>
            <span className={`inline-block ${Font_color_Type_1(isDark)}`}>
            더 보기 ({remainingCount > 0 ? remainingCount : 0})
          </span>
        </div>
      );
    }

    // 데이터가 있고, 다음 페이지가 없을 때 (모두 로드)
    if (!hasNextPage && fetchedPosts.length > 0) {
      return (
        <div onClick={handleExpandClick} className={`inline-block cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 ${hover_color_Type(isDark)}`}>
          <span className={`inline-block text-blue-600`}>댓글 접기</span>
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
    <div className="w-full">
      <div className="mb-4 w-auto">
        {renderButton()}
      </div>
      {renderContent()}
    </div>
  );
};

export default PostholderOfLoadMore;