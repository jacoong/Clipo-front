import React, {ReactNode,useEffect} from 'react';
import ProfileContainer from '../ProfileContainer';
import { Link } from 'react-router-dom';
import {activityDetailType} from '../../store/types';
import useModal from '../../customHook/useModal';
import Button from '../../compoents/Button';
import { AxiosError } from 'axios';
import { useMutation } from "react-query";
import Services from '../../store/ApiService';
import ButtonOfFollow from '../ButtonOfFollow';



const { UserService,SocialService } = Services;

const ActivityAccountItem =({itemInfo,isDark,children}:{ itemInfo:activityDetailType,isDark:boolean ,children: ReactNode; }) => {
    const {closeModal} = useModal();
    
    const handleCloseModal = ()=>{
        closeModal();
    }



      const formatProfileInfo = (item:activityDetailType)=>{
        const form = {nickName:item.from,following:item.isFollowing}
        console.log(form)
        return form
      }


return (
    <div className={`w-full px-3 flex no-underline ${
      isDark
        ? itemInfo.isRead ? 'bg-hovercustomBlack' : ''
        : itemInfo.isRead ? 'bg-gray-100' : ''
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

    <div className='flex items-center w-15'>
        {itemInfo.boardOneImage ?
        <div className='flex items-center'>
        <img className={'w-full h-36'}  src={itemInfo.boardOneImage}></img>
        </div>
        :
          <ButtonOfFollow width={'100%'} isOwner={false} isDark={isDark} profileInfo={formatProfileInfo(itemInfo)}></ButtonOfFollow>
         }
    
    </div>
</div> 
);
}



export default ActivityAccountItem;