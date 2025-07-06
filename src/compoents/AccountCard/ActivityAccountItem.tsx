import React, {ReactNode,useEffect} from 'react';
import ProfileContainer from '../ProfileContainer';
import { Link } from 'react-router-dom';
import {activityDetailType} from '../../store/types';
import useModal from '../../customHook/useModal';
import Button from '../../compoents/Button';
import { AxiosError } from 'axios';
import { useMutation } from "react-query";
import Services from '../../store/ApiService';




const { UserService,SocialService } = Services;

const ActivityAccountItem =({itemInfo,isDark,children}:{ itemInfo:activityDetailType,isDark:boolean ,children: ReactNode; }) => {
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
          handleFollowMutation.mutate(itemInfo.from)
        }catch{
          throw Error();
        }
      }

      const handleUnFollow = ()=>{
        try{
          handleUnFollowMutation.mutate(itemInfo!.from)
        }catch{
          throw Error();
        }
      }



return (
    <div className={`w-full px-3 flex no-underline ${
      isDark
        ? itemInfo.isRead ? 'bg-customGray' : ''
        : itemInfo.isRead ? 'bg-customWhite' : ''
    }`}>
    <div className='flex py-2 w-full'>
           <ProfileContainer profileImg={itemInfo.userProfileImage} nickName={itemInfo.from}></ProfileContainer>
       {/* <div className='w-full ml-3'>
           <div className='flex align-middle'>
               <Link onClick={handleCloseModal} className={`hover:underline font-bold text-base ${isDark? 'text-customWhite':'text-customBlack'}`} to={`/main/@/${itemInfo.nickName}`}>{itemInfo.nickName}</Link>
           </div>

       <div className='my-1 leading-5 whitespace-pre-wrap'>
           <h1>{itemInfo.email}</h1>
       </div>
       </div> */}
      {children}
       </div>

    <div className='flex items-center'>
        {itemInfo.boardOneImage ?
        <img className={'w-full h-20'}  src={itemInfo.boardOneImage}></img>
        :
        itemInfo.isFollowing
            ? <Button handleClick={handleUnFollow} width='100%' height='50px' color='white' padding='5px'>unFollow</Button>
            : <Button handleClick={handleFollow} width='100%' height='50px' color='white' padding='6px'>Follow</Button>
         }
    
    </div>
</div> 
);
}



export default ActivityAccountItem;