import { useMutation } from "react-query";
import Services from '../store/ApiService';
import { AxiosError } from "axios";
const { SocialService } = Services;

export const useUpdateisRead = () =>{
    const {
        mutate:handleUseUpdatedisRead,
        isLoading:isLoading, 
        isSuccess:isSuccess,
        isError:isError,
      } = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.isReadNno, {
     

        onSuccess: (data) => {
          console.log('isReadnno updat success', data);
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          alert('isReadnno updated faied')
        }
      });

      return {
        handleUseUpdatedisRead,
        isLoading,
        isSuccess,
        isError,
    };
}