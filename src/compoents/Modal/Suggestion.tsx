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



  return (
    <div
    className='h-auto overflow-auto z-30'
      style={{
        backgroundColor: focused
          ? isUser
            ? '#e6f7ff'
            : '#f0fdf4'
          : '#fff',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
      }}
    >

<div>
    
</div>
{suggestion ? (
  isUser ? (
    <ProfileContainer
      profileImg={suggestion.profilePicture}
      nickName={suggestion.nickName}
    />
  ) : (
    isNew ?
      <div>svgEffect</div>
    :
    <SearchTag
    isDark={isDark}
    tagName={suggestion.display}  // 예: #react 같은 텍스트
    />
    
  )
) : 
  null
}



      <div>
        <div>
            
        </div>
        <span style={{ flex: 1 }}>
            {isUser ? (
            highlightedDisplay
            ) : (
            null
            )}
        </span>

        {/* user의 경우 보조 ID 표시 */}
        {isUser && (
            <small style={{ color: '#888', marginLeft: 8 }}>
            {suggestion.email}
            </small>
        )}
      </div>
    </div>
  );
};

export default Suggestion;