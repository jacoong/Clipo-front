import Button from '../Button';

const SocialGoogle = ()=>
{
    const Rest_api_key= process.env.REACT_APP_GOOGLE_APIKEY as string //REST API KEY
    const redirect_uri = 'http://localhost:3000/auth/google' //Redirect URI
    // oauth 요청 URL


    const handleLogin = ()=>{
        window.location.href ="https://accounts.google.com/o/oauth2/auth?"+`client_id=${Rest_api_key}&`+ `redirect_uri=${redirect_uri}&`+"response_type=code&"+"scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
    }
    
    return(
    <>

        <Button handleClick={handleLogin} background_color={'b-white'} color={'black'}>Join with Google</Button>

    </>
    )
}
export default SocialGoogle

