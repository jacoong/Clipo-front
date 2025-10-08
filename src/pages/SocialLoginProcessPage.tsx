import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import Services from '../store/ApiService';
import { socialLogin, LogInServerResponse } from '../store/types';
import { LoginLogic } from '../store/axios_context';
import { useTheme } from '../customHook/useTheme';
import {
  Bg_color_Type_1,
  Bg_color_Type_2,
  Bg_color_Type_3,
  Border_color_Type,
  Font_color_Type_1,
  Font_color_Type_2,
} from '../store/ColorAdjustion';
import { TbLoader2 } from 'react-icons/tb';
import { GoogleLogo, KakaoLogo, NaverLogo } from '../compoents/SocialLogin/SocialIcons';
import { render } from '@testing-library/react';
import { SiNaver } from 'react-icons/si';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';  

function SocialLoginProcessPage() {
  const navigate = useNavigate();
  const { typeOfPlatform } = useParams<{ typeOfPlatform: string }>();
  const { isDark } = useTheme();

  const [statusMessage, setStatusMessage] = useState('소셜 로그인 처리중이에요.');
  const [subMessage, setSubMessage] = useState('잠시만 기다려 주세요.');
  const [isError, setIsError] = useState(false);

  const platformLabel = useMemo(() => {
    const labels: Record<string, string> = {
      google: 'Google',
      kakao: 'Kakao',
      naver: 'Naver',
    };
    if (!typeOfPlatform) return 'Social';
    return labels[typeOfPlatform] ?? 'Social';
  }, [typeOfPlatform]);

  const { AuthService } = Services;

  const renderIcon = () => {
    const logoClassName = 'h-9 w-9';

    switch (typeOfPlatform) {
      case 'google':
        return <GoogleLogo className={logoClassName} />;
      case 'kakao':
        return <KakaoLogo className={logoClassName} />;
      case 'naver':
        return <NaverLogo className={logoClassName} />;
      default:
        return <TbLoader2 className="text-3xl text-themeColor" />;
    }
  };

  const { mutate, isLoading } = useMutation<
    LogInServerResponse,
    AxiosError<{ message: string }>,
    socialLogin
  >(AuthService.socialLogin, {
    onSuccess: (data) => {
      const accessToken = data.body.accessToken.replace('Bearer ', '');
      const refreshToken = data.body.refreshToken.replace('Bearer ', '');
      const validateTime = data.body.validateTime;
      LoginLogic({ accessToken, refreshToken, validateTime });
      navigate('/main', { replace: true });
    },
    onError: () => {
      setIsError(true);
      setStatusMessage('로그인에 실패했어요.');
      setSubMessage('다시 시도해주세요. 잠시 후 로그인 페이지로 이동합니다.');
      setTimeout(() => navigate('/', { replace: true }), 1500);
    },
  });



  useEffect(() => {
    if (!typeOfPlatform) {
      setIsError(true);
      setStatusMessage('잘못된 접근입니다.');
      setSubMessage('로그인 페이지로 이동합니다.');
      const timer = setTimeout(() => navigate('/', { replace: true }), 1500);
      return () => clearTimeout(timer);
    }

    const isSupported = ['google', 'kakao', 'naver'].includes(typeOfPlatform);

    if (!isSupported) {
      navigate('/404', { replace: true });
      return;
    }

    const url = new URL(window.location.href);
    const codeParam = url.searchParams.get('code');

    if (!codeParam) {
      setIsError(true);
      setStatusMessage('인증 코드가 확인되지 않았어요.');
      setSubMessage('소셜 로그인을 처음부터 다시 진행해주세요.');
      return;
    }

    setIsError(false);
    setStatusMessage(`${platformLabel} 계정과 연결 중입니다.`);
    setSubMessage('잠시만 기다려 주세요.');

    mutate({ code: codeParam, typeOfPlatform });
  }, [mutate, navigate, platformLabel, typeOfPlatform]);

  return (
    <div
      className={`flex min-h-screen w-full items-center justify-center px-6 py-16 transition-colors duration-300 ${Bg_color_Type_1(
        isDark,
      )}`}
    >
      <div
        className={`w-full max-w-md rounded-3xl border px-8 py-12 shadow-lg backdrop-blur-md transition-colors duration-300 ${Bg_color_Type_2(
          isDark,
        )} ${Border_color_Type(isDark)}`}
      >
        <div className={`flex flex-col items-center gap-4 text-center `}>
                 <div
            className={`flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full border ${
              isError ? 'border-red-400 bg-red-500/10 text-red-500' : 'border-themeColor bg-themeColor/10'
            }`}
          >
            {renderIcon()}
     
           
          </div>
            <TbLoader2
              className={`text-xl ${isError ? '' : 'animate-spin'} ${
                isError ? 'text-red-500' : 'text-themeColor'
              }`}
            />
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${Font_color_Type_1(isDark)}`}>
              {statusMessage}
            </p>
            <p className={`text-sm ${isError ? 'text-red-400' : Font_color_Type_1(isDark)}`}>
              {subMessage}
            </p>
          </div>

          <div
            className={`w-full rounded-2xl p-4 transition-colors duration-300 ${Bg_color_Type_3(
              isDark,
            )}`}
          >
            <p className={`text-sm ${Font_color_Type_1(isDark)}`}>
              {isLoading
                ? `${platformLabel} 인증 서버와 통신 중이에요.`
                : isError
                ? '창을 닫지 말고 안내에 따라 주세요.'
                : '연결이 완료되면 자동으로 이동해요.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialLoginProcessPage;
