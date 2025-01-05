import React, {ReactNode,useEffect} from 'react';
import ProfileContainer from '../ProfileContainer';
import { Link } from 'react-router-dom';
import {UserInfo} from '../../store/types';
import useModal from '../../customHook/useModal';
import Button from '../../compoents/Button';
import { AxiosError } from 'axios';
import { useMutation } from "react-query";
import Services from '../../store/ApiService';


interface AccountUserInfo extends Omit<UserInfo, 'nickName'> {
    nickName: string; // null이 아님
  }


const { UserService,SocialService } = Services;

const AccountItem =({itemInfo,isDark}:{ itemInfo:AccountUserInfo,isDark:boolean }) => {
    const {closeModal} = useModal();
    
    const handleCloseModal = ()=>{
        closeModal();
    }

    const handleUnFollowMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.unFolowUserAccount, {
     
        onSuccess: (data) => {
          console.log('언팔로잉 완료', data);
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          alert('언팔로잉중 오류발생')
        }
      });


      const handleFollowMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.folowUserAccount, {
     
        onSuccess: (data) => {
          console.log('팔로잉 완료', data);
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          alert('팔로잉중 오류발생')
        }
      });



      const handleFollow = ()=>{
        // setFetchedUser((prev) => ({
        //   ...prev, // 이전 상태 복사
        //   isFollowing: !prev?.isFollowing, // isFollowing 값을 반전
        // }));
        try{
          handleFollowMutation.mutate(itemInfo.nickName)
        }catch{
          throw Error();
        }
      }

      const handleUnFollow = ()=>{
        try{
          handleUnFollowMutation.mutate(itemInfo!.nickName)
        }catch{
          throw Error();
        }
      }


return (
    <div className={`w-full flex no-underline border-b ${isDark?'border-customLightGray':'border-customGray'}`}>
    <div className='flex px-3 py-2 w-full'>
           <ProfileContainer profileImg={itemInfo.profilePicture} nickName={itemInfo.nickName}></ProfileContainer>
       <div className='w-full ml-3'>
           <div className='flex align-middle'>
               <Link onClick={handleCloseModal} className={`hover:underline font-bold text-base ${isDark? 'text-customWhite':'text-customBlack'}`} to={`/main/@/${itemInfo.nickName}`}>{itemInfo.nickName}</Link>
           </div>

       <div className='my-1 leading-5 whitespace-pre-wrap'>
           <h1>{itemInfo.email}</h1>
       </div>
       </div>
       </div>
    <div className=''>
        {itemInfo.isFollowing
    ? <Button handleClick={handleUnFollow} width='100%' height='50px' color='white' padding='5px'>unFollow</Button>
    : <Button handleClick={handleFollow} width='100%' height='50px' color='white' padding='6px'>Follow</Button>
        }
    </div>
</div> 
);
}



export default AccountItem;