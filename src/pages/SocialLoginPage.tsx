import { useNavigate } from 'react-router-dom';
import { useTheme } from '../customHook/useTheme';
import JoinAsAdmin from '../compoents/SocialLogin/JoinAsAdmin';
import SocialGoogle from '../compoents/SocialLogin/SocialGoogle';
import SocialKakao from '../compoents/SocialLogin/SocialKakao';
import SocialNaver from '../compoents/SocialLogin/SocialNaver';
import { HiOutlineArrowLeft } from 'react-icons/hi'
import {Bg_color_Type_1} from '../store/ColorAdjustion';

const SocialLoginPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col w-full min-h-screen `}>        
      <button
        onClick={() => navigate('/')}
        className='md:hidden px-5 py-4 flex items-center gap-1 text-sm font-medium text-themeColor'
      >
        <HiOutlineArrowLeft className='text-lg' />
        <span>이전으로</span>
      </button>

      <main className='flex-1 flex flex-col items-center justify-center px-4 py-10'>

        <div className='w-full max-w-md space-y-8 md:rounded-2xl px-8 py-5  backdrop-blur  border-transparent md:border md:border-slate-100 md:shadow-lg' style={{backgroundColor: Bg_color_Type_1(isDark)}}>
            <button
              onClick={() => navigate('/')}
              className='hidden md:flex items-center justify-center gap-1 text-sm font-medium text-themeColor'
            >
              <HiOutlineArrowLeft className='text-lg' />
              <span>이전으로</span>
            </button>
          <div className='text-center space-y-3'>
            <h1 className='text-2xl font-bold'>소셜 계정으로 로그인</h1>
            <p className='text-sm text-slate-500 leading-relaxed'>선호하는 계정을 선택하여 간편하게 로그인하세요.</p>
          </div>

          <div className='space-y-3 flex flex-col items-center'>
            <SocialGoogle />
            <SocialKakao />
            <SocialNaver />
       

          <div className='pt-4 border-t border-slate-200 space-y-3'>
            <JoinAsAdmin />
          
          </div>
             </div>
        </div>
      </main>
    </div>
  );
};

export default SocialLoginPage;
