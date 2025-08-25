import React, { ReactNode, useEffect } from 'react';
import { MentionItem } from 'react-mentions';
import ProfileContainer from '../ProfileContainer';
import SearchTag from '../AccountCard/SearchTag';
import { svgEffect } from 'framer-motion';
interface SuggestionProps {
  suggestion: any;
  highlightedDisplay: ReactNode;
  focused: boolean;
  type: 'user' | 'tag';
  isDark:boolean;
}

/**
 * 통합 Suggestion 컴포넌트
 */
const Suggestion: React.FC<SuggestionProps> = ({
  suggestion,
  highlightedDisplay,
  focused,
  type,
  isDark
}) => {
  const isUser = type === 'user';
  const isNew = suggestion.id === 'new'

  // border ${isDark ? 'border-customLightGray' : 'border-customGray'}

  const bgClass =
  focused && isDark
    ? 'bg-customLightBlack'
    : focused && !isDark
    ? 'bg-hoverLightGray'
    : !focused && isDark
    ? 'bg-customLightGray'
    : 'bg-customLightGray';

  return (
    <div
    className={` w-64 px-2 py-2 flex cursor-pointer h-auto overflow-hidden border-b  ${
    isDark ? 'border-b-customLightGray' : 'border-b-customGray'
  }  ${bgClass}`}
    >

<div>
    
</div>
{suggestion ? (
  isUser ? (
    <ProfileContainer
    isClickable={false}
      profileImg={suggestion.profilePicture}
      nickName={suggestion.nickName}
    />
  ) : (
    isNew ?
    <div>
      <p className='font-extrabold'>{suggestion.display}</p>
      <div className={`mt-3 flex ${isDark ? 'text-customRealWhite' : 'text-customGray'} `}>
      <p>+ </p>
      <p>새로운 주제 태그하기</p>
      </div>
    </div>
    :
    <SearchTag
    isClickable={false}
    isDark={isDark}
    tagName={suggestion.display}  // 예: #react 같은 텍스트
    />
    
  )
) : 
  null
}



      <div>
        <div className='flex ml-3 justify-between flex-col'>
        <span style={{ flex: 1 }}>
            {isUser ? (
            highlightedDisplay
            ) : (
            null
            )}
        </span>

        {/* user의 경우 보조 ID 표시 */}
        {isUser && (
            <small style={{ color: '#888' }}>
            {suggestion.email}
            </small>
        )}
        </div>

      </div>
    </div>
  );
};

export default Suggestion;