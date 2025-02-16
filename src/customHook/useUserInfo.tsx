// useUserProfile.ts
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import Services from '../store/ApiService';
import { simpleUserInfo } from '../store/types';

const useUserProfile = () => {
    const { UserService } = Services;

  return useQuery<any, AxiosError<{ message: string }>>(
    'userProfile',
    () => UserService.getUserProfile(),
    { 
    refetchOnWindowFocus:false
     },
  );
};

export default useUserProfile;
