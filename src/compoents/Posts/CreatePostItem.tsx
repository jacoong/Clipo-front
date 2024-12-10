import React, {ReactNode,useEffect} from 'react';
import ProfileContainer from '../ProfileContainer';
import { Link } from 'react-router-dom';
import {UserInfo} from '../../store/types';
import useModal from '../../customHook/useModal';

const ContentSlider =({itemInfo,isDark}:{ itemInfo:UserInfo,isDark:boolean }) => {
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
               <h1 className={`font-bold text-base ${isDark? 'text-customWhite':'text-customBlack'}`}>{itemInfo.nickName}</h1>
           </div>

       <div className='my-1 leading-5 whitespace-pre-wrap'>
           <textarea placeholder='포스트를 입력하세요'></textarea>
       </div>
       </div>
       </div>
</div> 
);
}



export default ContentSlider;