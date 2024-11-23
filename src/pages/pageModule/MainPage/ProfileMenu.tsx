import React, {ReactNode,useState} from 'react';
import { useParams } from 'react-router-dom';
import {useTheme} from '../../../customHook/useTheme';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import {fetchedUserInfo} from '../../../store/types';
const ProfileMenu =() => {
    // const [loading, setLoading] = useState<fetchedUserInfo>(true);
    const {username} = useParams();
    const { isDark } = useTheme();
    const isOwnPage = () =>{

    }

    // const getUserInfoMutation = useMutation<string, AxiosError<{ message: string }>>(UserService.getUserProfile, {
    //     onSuccess: (data) => {
    //       console.log('User Profile Data:', data);

    //     //   isUserLogin(data);
    //     //   setLoading(false);
    //     },
    //     onError: (error:AxiosError) => {
    //       alert(error.response?.data ||'회원가입 실패');
    //     }
    //   });

return (

    <div className='p-10 flex justify-between'>
    <div className='w-10 h-10 '>
        {username}
    </div>
    <div className='w-10 h-10 '>
        {username}
    </div>
    </div>
);
}



export default ProfileMenu;