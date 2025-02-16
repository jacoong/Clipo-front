import { useNavigate } from 'react-router-dom';

// 커스텀 훅은 반드시 함수 이름이 use로 시작해야 ESLint가 인식합니다.
const useNavigateUnAuthenticatedUser = () => {
  const navigate = useNavigate();

  const navigateUnAuthenticatedUser = (previousUrl: string) => {
    console.log('unAuthenticateUser executed');
    localStorage.setItem('previousUrl', previousUrl);
    navigate('/');
  };

  return navigateUnAuthenticatedUser;
};

export default useNavigateUnAuthenticatedUser;
