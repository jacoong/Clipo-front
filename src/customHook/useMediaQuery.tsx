import { useState, useEffect } from 'react';

/**
 * 미디어 쿼리를 감지하는 커스텀 훅
 * @param query - CSS 미디어 쿼리 문자열 (예: "(max-width: 768px)")
 * @returns boolean - 쿼리가 매치되면 true, 아니면 false
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR 환경에서는 window 객체가 없으므로 체크
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // 초기 상태 설정
    setMatches(mediaQuery.matches);

    // 리스너 함수
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 이벤트 리스너 등록 (addEventListener 사용)
    mediaQuery.addEventListener('change', handleChange);

    // 정리 함수
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;

