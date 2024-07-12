
import Button from '../Button';


const SocialKakao = ()=>
{
    const Rest_api_key= process.env.REACT_APP_KAKAO_APIKEY as string //REST API KEY
    const redirect_uri = 'http://localhost:3000/auth/kakao' //Redirect URI
    // oauth 요청 URL
    const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
    const handleLogin = ()=>{
        window.location.href = kakaoURL
    }
    return(
    <>
        <Button handleClick={handleLogin} background_color={'b-kakao'} color={'black'}>Join with kakao</Button>
    </>
    )
}
export default SocialKakao

