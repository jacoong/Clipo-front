import Button from '../../Button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../customHook/useTheme';
import { removeCookie } from '../../../store/coockie';
import useModal from '../../../customHook/useModal';
import { Font_color_Type_1, Font_color_Type_2 } from '../../../store/ColorAdjustion';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const SessionExpired = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { closeAllModal } = useModal();

  const handleReLogin = () => {
    closeAllModal();
    removeCookie('refreshToken', { path: '/', secure: true });
    removeCookie('accessToken', { path: '/', secure: true });
    navigate('/');
  };

  const iconWrapperClass = isDark
    ? 'bg-customLightBlack text-themeColor'
    : 'bg-slate-100 text-themeColor';

  return (
    <div className='flex flex-col items-center text-center px-6 py-4 gap-5'>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${iconWrapperClass}`}>
        <HiOutlineExclamationCircle className='text-3xl' />
      </div>

      <div className='space-y-2'>
        <h2 className={`text-lg font-semibold ${Font_color_Type_1(isDark)}`}>
          세션이 만료되었어요
        </h2>
        <p className={`text-sm leading-relaxed ${Font_color_Type_2(isDark)}`}>
          보안을 위해 자동으로 로그아웃되었습니다.<br />
          다시 로그인하여 서비스를 계속 이용해 주세요.
        </p>
      </div>

      <div className='w-full space-y-2'>
        <Button
          handleClick={handleReLogin}
          width='100%'
          padding='10px'
        >
          다시 로그인
        </Button>
      </div>
    </div>
  );
};

export default SessionExpired;
