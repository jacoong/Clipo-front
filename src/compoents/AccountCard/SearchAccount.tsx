import React, {ReactNode,useEffect} from 'react';
import ProfileContainer from '../ProfileContainer';
import { Link } from 'react-router-dom';
import {UserInfo} from '../../store/types';
import useModal from '../../customHook/useModal';
import Services from '../../store/ApiService';
import PostItem from '../Posts/PostItem';
import UserAccount from '../../compoents/Posts/UserAccount';

interface AccountUserInfo extends Omit<UserInfo, 'nickName'> {
    nickName: string; // null이 아님
  }


const SearchAccount =({itemInfo,isDark}:{ itemInfo:AccountUserInfo,isDark:boolean }) => {
    const {openModal,closeModal} = useModal();
    

const showUserAccount = (action:string)=>{
    if(action === 'open'){
    openModal({ type:'Popup', props: { isPotal:true,typeOfPopup:'accountInfo', potalSpot:`accountInfo${itemInfo.nickName}`,value:{username:itemInfo.nickName,locationValue:'480px'}} });
    }else{
        closeModal();
    }
    }


return (
    // <Link to={`/main/@/${itemInfo.nickName}`} className={`cursor-pointer w-full flex no-underline border-b ${isDark?'border-customLightGray':'border-customGray'}`}>
    <div className={`cursor-pointer w-full flex no-underline`}>
    <div className='flex w-full'>
       <div className='w-full ml-3'>
           <div className='flex align-middle'>
            <UserAccount isDark={isDark} username={itemInfo.nickName} idNum={itemInfo.nickName}></UserAccount>
           </div>

       <div className='leading-5 whitespace-pre-wrap'>
           <h1>{itemInfo.email}</h1>
       </div>
       </div>
       </div>
</div> 
);
}



export default SearchAccount;