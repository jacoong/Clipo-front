export const darkModeCheck = () => {
    // localStorage에서 isDarkMode 값을 읽습니다.
    const savedMode = localStorage.getItem('isDarkMode');
  
    // isDarkMode 값이 저장되어 있지 않은 경우, 기본값으로 true를 설정합니다.
    if (savedMode === null) {
      localStorage.setItem('isDarkMode', 'false');
      return false; // 기본값으로 다크 모드를 활성화합니다.
    }
    return JSON.parse(savedMode); //
}