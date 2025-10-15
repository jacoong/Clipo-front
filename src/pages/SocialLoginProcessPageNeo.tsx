import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { AxiosError } from 'axios';
import Services from '../store/ApiService';
import { LoginType, LogInServerResponse } from '../store/types';
import { LoginLogic } from '../store/axios_context';
import { useTheme } from '../customHook/useTheme';
import {
  Bg_color_Type_1,
  Bg_color_Type_2,
  Bg_color_Type_3,
  Border_color_Type,
  Font_color_Type_1,
} from '../store/ColorAdjustion';
import { TbLoader2 } from 'react-icons/tb';
import { RiAdminFill } from "react-icons/ri"; 

function SocialLoginProcessPageNeo() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [statusMessage, setStatusMessage] = useState('네오로 처리중...');
  const [subMessage, setSubMessage] = useState('잠시만 기다려 주세요.');
  const [isError, setIsError] = useState(false);



  const { AuthService } = Services;

    const guestAccount = {
        email: "neo@gmail.com",
        password: "2#!@%!32$!%^!",
    };



    const {mutate,isLoading} = useMutation<
    LogInServerResponse,
    AxiosError<{ message: string }>,
    LoginType
  >(AuthService.LoginNeo, {
        onSuccess: (res) => {
            console.log('mutation data', res.data);
            const accessToken = res.data.body.accessToken.replace("Bearer ", "");
            const refreshToken = res.data.body.refreshToken.replace("Bearer ", "");
            const validateTime = res.data.body.validateTime;
            LoginLogic({accessToken, refreshToken, validateTime});
            navigate('/main');
        },
        onError: (error: AxiosError) => {
            console.error('로그인 실패:', error);
            setIsError(true);   
            setStatusMessage('네오 로그인에 실패했어요.');
            setSubMessage('잠시 후 다시 시도해 주세요.');
            setTimeout(() => navigate('/', { replace: true }), 1500);
        }
    });

    useEffect(() => {
        mutate(guestAccount);
    }, []);



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
                <RiAdminFill className='h-9 w-9'></RiAdminFill>
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
                ? `Clipo 인증 서버와 통신 중이에요.`
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

export default SocialLoginProcessPageNeo;
