import Button from '../Button';
import { FcGoogle } from "react-icons/fc";
import PixelBlast from '../PixelBlast';
import LightingBg from '../LightingBg';
import ApiService from '../../store/ApiService';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoginLogic } from '../../store/axios_context';

const JoinAsAdmin = ()=>
{
    const guestAccount = {
        email: "neo@gmail.com",
        password: "2#!@%!32$!%^!",
    };

    const { AuthService } = ApiService;
    const navigate = useNavigate();

    const loginMutation = useMutation(AuthService.LoginNeo, {
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
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    });

    const handleLogin = () => {
        loginMutation.mutate(guestAccount);
    }
    
    return(
    <>

            
            {/* 에러 해결 버튼 */}
            <div 
                className="mb-2 bg-black border-1 border-[#184f15] w-[300px] h-[52px] relative rounded-[24px] cursor-pointer overflow-hidden animate-pulse-scale hover:shadow-[0_0_20px_#184f15] transition-shadow duration-300"
                onClick={handleLogin}
            >
            <LightingBg
                hue={161}
                xOffset={0.6}
                speed={1.0}
                intensity={1}
                size={1.5}
            />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-extrabold text-lg">게스트(Neo)로 로그인</span>
                </div>
            </div>

    </>
    )
}
export default JoinAsAdmin



