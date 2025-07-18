import React, {ReactNode,useEffect} from 'react';
import ProfileContainer from '../ProfileContainer';
import { Link } from 'react-router-dom';
import {UserInfo} from '../../store/types';
import useModal from '../../customHook/useModal';
import Button from '../../compoents/Button';
import { AxiosError } from 'axios';
import { useMutation } from "react-query";
import Services from '../../store/ApiService';
import ButtonOfFollow from '../../compoents/ButtonOfFollow';
import useUserProfile from '../../customHook/useUserInfo';


const { UserService,SocialService } = Services;

const AccountItem =({itemInfo,isDark,children,preventEditProfile}:{ itemInfo:UserInfo,isDark:boolean ,children: ReactNode,preventEditProfile?:boolean }) => {
    const {closeModal} = useModal();
    const { data: loginUserProfile, isLoading:isUserProfileLoading, isError:isUserProfileError } = useUserProfile();
    const LoginUser = isUserProfileError?undefined:loginUserProfile.body;

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



      const handleFollow = (e: React.MouseEvent)=>{
        // setFetchedUser((prev) => ({
        //   ...prev, // 이전 상태 복사
        //   isFollowing: !prev?.isFollowing, // isFollowing 값을 반전
        // }));
        e.stopPropagation();  // 부모 Link 클릭 전파 방지
        e.preventDefault(); 
        try{
          handleFollowMutation.mutate(itemInfo.nickName)
        }catch{
          throw Error();
        }
      }

      const handleUnFollow = (e: React.MouseEvent)=>{
        e.stopPropagation();  // 부모 Link 클릭 전파 방지
        e.preventDefault(); 
        try{
          handleUnFollowMutation.mutate(itemInfo!.nickName)
        }catch{
          throw Error();
        }
      }

      useEffect(()=>{
        console.log(itemInfo)

      },[itemInfo])

      const isOwner = LoginUser.nickName === itemInfo.nickName;


return (
    <div className={`px-3 w-full flex no-underline`}>
      <div className='flex py-2 w-full'>
        <div className='flex items-center'>
          <ProfileContainer profileImg={itemInfo.profilePicture} nickName={itemInfo.nickName}></ProfileContainer>
        </div>
        
        {/* <div className='w-full ml-3'>
            <div className='flex align-middle'>
                <Link onClick={handleCloseModal} className={`hover:underline font-bold text-base ${isDark? 'text-customWhite':'text-customBlack'}`} to={`/main/@/${itemInfo.nickName}`}>{itemInfo.nickName}</Link>
            </div>
  mt-[1rem]
        <div className='my-1 leading-5 whitespace-pre-wrap'>
            <h1>{itemInfo.email}</h1>
        </div>
        </div> */}
        {children}
      </div>
      <div className='flex items-center'>
        { isOwner === true && preventEditProfile === true ?
          <></> :
          <ButtonOfFollow isOwner={isOwner} isDark={isDark} profileInfo={itemInfo}></ButtonOfFollow>
        }
        {/* {itemInfo.isFollowing
      ? <Button handleClick={handleUnFollow} width='100%' height='50px' color='white' padding='5px'>unFollow</Button>
      : <Button handleClick={handleFollow} width='100%' height='50px' color='white' padding='6px'>Follow</Button>
          } */}
      </div>
    </div> 
  );
}



export default AccountItem;