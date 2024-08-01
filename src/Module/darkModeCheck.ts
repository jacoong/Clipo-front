export const darkModeCheck = () => {
    const savedMode = localStorage.getItem('isDarkMode');

    if (savedMode === null) {
        localStorage.setItem('isDarkMode', JSON.stringify(false));
        return false; // 기본값으로 다크 모드를 활성화합니다.
    }
    return JSON.parse(savedMode);
};