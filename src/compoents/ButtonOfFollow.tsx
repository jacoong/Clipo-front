import React, {ReactNode,useState} from 'react';
import Button from '../compoents/Button';
import style from '../compoents/compoentsCss/Button.module.css';
import { useTheme } from '../customHook/useTheme';
import Loading from './Loading';
import useModal from '../customHook/useModal';
import { useMutation,useQuery } from "react-query";
import { AxiosError } from 'axios';
import Services from '../store/ApiService';
import { useQueryClient } from 'react-query';

type ButtonOfFollowType = {
    width?:string;
    padding?:string;
    color?:string;
    profileInfo:undefined|any
    isDark:boolean;
    isOwner:boolean;
};

const { UserService,SocialService } = Services;


const ButtonOfFollow =({isOwner,profileInfo,isDark,width='100%',color = isDark ? 'white' : 'black',padding}:ButtonOfFollowType) => {
    const { openModal } = useModal();
    const queryClient = useQueryClient();
    const openEditProfile = ()=>{
        openModal({ type:'editProfile', props: { isModalLayer:true, isForce:true,value:{profileInfo},modal:{width:'w-104',navButtonOption:{isClose:true}}} });
        // openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
      }
 

      const handleRefresh = () => {
        queryClient.invalidateQueries(['profileInfo', profileInfo.nickName]);

      };

    const {
        mutate:handleFollowMutation,
        isLoading:followIsLoading, 
        isSuccess:followIsSuccess,
        isError:followIsError,
      } = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.folowUserAccount, {
     
        onSuccess: (data) => {
          handleRefresh();
          console.log('팔로잉 완료', data);
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          alert('팔로잉중 오류발생')
        }
      });


      const {
        mutate:handleUnFollowMutation,
        isLoading:unFollowIsLoading, 
        isSuccess:unFollowIsSuccess,
        isError:unFollowIsError,
      } = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.unFolowUserAccount, {
     
        onSuccess: (data) => {
          console.log('언팔로잉 완료');
          handleRefresh();
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          alert('언팔로잉중 오류발생')
        }
      });



      const handleFollow = ()=>{
        try{
          handleFollowMutation(profileInfo!.nickName)
        }catch{
          throw Error();
        }
      }

      const handleUnFollow = ()=>{
        try{
          handleUnFollowMutation(profileInfo!.nickName)
        }catch{
          throw Error();
        }
      }

      


return (
    <div className="w-[7rem]">
    {
      isOwner
    //   ? <Button handleClick={handleEdit} bolder='bold' width='large' Background_color='b-blue'><span>Edit</span></Button>
      ? <Button handleClick={openEditProfile} width='100%' color='white' padding='6px'>Edit Profile</Button>
    //   : userInfo.isFollower
      :
      profileInfo.following
      ? <Button isLoading={unFollowIsLoading} handleClick={handleUnFollow} width='100%' color='white' padding='6px'>unFollow</Button>
      : <Button isLoading={followIsLoading} handleClick={handleFollow} width='100%' color='white' padding='6px'>Follow</Button>
    }
  </div>
);
}



export default ButtonOfFollow;