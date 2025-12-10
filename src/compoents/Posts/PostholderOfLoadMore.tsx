import React, { useCallback,useEffect,useRef } from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';
import { Border_color_Type, Font_color_Type_1, hover_color_Type } from '../../store/ColorAdjustion';
import Loading from '../Loading';
interface PostholderOfLoadMoreProps {
  fetchedPosts: userPost[];
  isDark: boolean;
  numberOfComments: number;
  onLoadMore: () => void;
  onLoadPrev?: () => void;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
  isCollapsed: boolean;
  onExpand: () => void;
  // 💡 react-query 최신 버전을 위해 'pending' 추가
  status: 'idle' | 'pending' | 'loading' | 'success' | 'error';
  isFetchingNextPage: boolean;
  scrollTargetId?: number;
}

const PostholderOfLoadMore = ({
  fetchedPosts,
  isDark,
  numberOfComments,
  onLoadMore,
  onLoadPrev,
  hasNextPage,
  hasPrevPage,
  isCollapsed,
  onExpand,
  status,
  isFetchingNextPage,
  scrollTargetId,
}: PostholderOfLoadMoreProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledRef = useRef(false);
  
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

  useEffect(() => {
    hasScrolledRef.current = false;
  }, [scrollTargetId]);

  useEffect(() => {
    if (scrollTargetId && targetRef.current && !hasScrolledRef.current && status === 'success') {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hasScrolledRef.current = true;
    }
  }, [scrollTargetId, fetchedPosts, status]);

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

    const controls = [];

    if (hasPrevPage) {
      controls.push(
        <div
          key="prev"
          onClick={(e) => {
            e.stopPropagation();
            onLoadPrev?.();
          }}
          className={`inline-block cursor-pointer py-2 px-3 mr-2 rounded-lg transition-all duration-200 ${hover_color_Type(isDark)}`}
        >
          <span className={`inline-block ${Font_color_Type_1(isDark)}`}>이전 댓글 불러오기</span>
        </div>
      );
    }

    if (hasNextPage) {
      const remainingCount = numberOfComments - fetchedPosts.length;
      controls.push(
        <div
          key="next"
          onClick={handleLoadMoreClick}
          className={`inline-block cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 ${hover_color_Type(isDark)}`}
        >
          <span className={`inline-block ${Font_color_Type_1(isDark)}`}>
            대댓글 더 로드하기 ({remainingCount > 0 ? remainingCount : 0})
          </span>
        </div>
      );
    }

    if (controls.length > 0) {
      return <div className="flex flex-wrap gap-2">{controls}</div>;
    }

    // 데이터가 있고, 다음/이전 페이지가 없을 때 (모두 로드)
    if (!hasNextPage && !hasPrevPage && fetchedPosts.length > 0) {
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
          {fetchedPosts.map((post) => {
            const shouldAttachRef = scrollTargetId != null && post.rno === scrollTargetId;
            return(
            <div key={post.rno} ref={shouldAttachRef ? targetRef : undefined} id={shouldAttachRef ? `post-rno-${post.rno}` : undefined}>
              <div className={`${post.typeOfPost === 'nestRe' ? 'py-2' : 'border-b'} ${Border_color_Type(isDark)}`}>
                <PostItem 
                  isDark={isDark} 
                  postInfo={post} 
                  targetNestId={scrollTargetId}
                  nestInitialPage={0}
                />
              </div>
            </div>
          )})}
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
