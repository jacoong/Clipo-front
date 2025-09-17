import Button from '../Button';
import { FcGoogle } from "react-icons/fc";

const SocialGoogle = ()=>
{
    const Rest_api_key= process.env.REACT_APP_GOOGLE_APIKEY as string //REST API KEY
    const redirect_uri = 'http://localhost:3000/auth/google' //Redirect URI
    // oauth 요청 URL


    const handleLogin = ()=>{
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

