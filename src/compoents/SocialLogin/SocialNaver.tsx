import Button from '../Button';

const SocialNaver = ()=>
{
    const Rest_api_key= process.env.REACT_APP_NAVER_APIKEY as string //REST API KEY
    const redirect_uri = 'http://localhost:3000/auth/naver' //Redirect URI
    // oauth 요청 URL


    const generateState = () => {
        const array = new Uint32Array(4);
        crypto.getRandomValues(array);
        return Array.from(array, decimal => decimal.toString(32)).join('');
    }
    


    const handleLogin = ()=>{
        const state = generateState();
        window.location.href =`https://nid.naver.com/oauth2.0/authorize?client_id=${Rest_api_key}&response_type=code&redirect_uri=${redirect_uri}&state=${state}`
    }

    return(
    <>
        <Button handleClick={handleLogin} background_color={'b-white'} color={'black'}>Join with Naver</Button>
    </>
    )
}
export default SocialNaver