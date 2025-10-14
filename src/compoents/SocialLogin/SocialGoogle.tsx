import Button from '../Button';
import { FcGoogle } from "react-icons/fc";

const SocialGoogle = ()=>
{
    const Rest_api_key= process.env.REACT_APP_GOOGLE_APIKEY as string //REST API KEY
    const redirect_uri = process.env.REACT_APP_CLIENT_URL+'/auth/google' //Redirect URI
    // oauth 요청 URL


    const handleLogin = ()=>{
        window.location.href ="https://accounts.google.com/o/oauth2/auth?"+`client_id=${Rest_api_key}&`+ `redirect_uri=${redirect_uri}&`+"response_type=code&"+"scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
    }
    
    return(
    <>

        <Button handleClick={handleLogin} background_color={'b-google'} color={'black'}>
            <div className='flex ml-14 items-center'>
                <FcGoogle className='text-xl'/>
                <p className='mx-2'>Join with Google</p>
            </div>
        </Button>

    </>
    )
}
export default SocialGoogle

