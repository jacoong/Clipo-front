import { RiKakaoTalkFill } from "react-icons/ri";
import Button from '../Button';


const SocialKakao = ()=>
{
    const Rest_api_key= process.env.REACT_APP_KAKAO_APIKEY as string //REST API KEY
    const redirect_uri = process.env.REACT_APP_CLIENT_URL+'/auth/kakao' //Redirect URI
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
    const handleLogin = ()=>{
        window.location.href = kakaoURL
    }
    return(
    <>
        <Button handleClick={handleLogin} background_color={'b-kakao'} color={'black'}>
        <div className='flex ml-14 items-center'>
                <RiKakaoTalkFill className='text-lg'/>
                <p className='mx-2'> Join with kakao</p>
            </div>
        </Button>
    </>
    )
}
export default SocialKakao

