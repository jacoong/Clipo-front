import React, {ReactNode,useEffect} from 'react';
import ProfileContainer from '../ProfileContainer';
import { Link } from 'react-router-dom';
import {UserInfo} from '../../store/types';
import useModal from '../../customHook/useModal';

const AccountItem =({itemInfo,isDark}:{ itemInfo:UserInfo,isDark:boolean }) => {
    const {closeModal} = useModal();
    
    const handleCloseModal = ()=>{
        closeModal();
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
</div> 
);
}



export default AccountItem;