import React, {ReactNode,useEffect} from 'react';
import AccountItem from './AccountItem';
import {UserInfo} from '../../store/types';
import { Link } from 'react-router-dom';
import useModal from '../../customHook/useModal';
import TransitionDiv from '../TransitionDiv';
interface AccountUserInfo extends Omit<UserInfo, 'nickName'> {
    nickName: string; // null이 아님
    preventEditProfile?:boolean
  }

const Followholder =({accountInfo,isDark,preventEditProfile}:{ accountInfo:AccountUserInfo[],isDark:boolean,preventEditProfile?:boolean }) => {

    console.log(accountInfo)
    const {closeModal} = useModal();
    const handleCloseModal = ()=>{
        closeModal();
    }

return (
    accountInfo.length>0?
    <div className=''>
    {
                   accountInfo.map((accountForm:AccountUserInfo,index:any)=>(
                    <TransitionDiv isDark={isDark}>
  <div key={`accountInfo${index}`}>
                        <AccountItem isDark={isDark} itemInfo={accountForm} preventEditProfile={preventEditProfile}>
                            <div className='w-full ml-3'>
                                    <div className='flex align-middle'>
                                        <Link onClick={handleCloseModal} className={`hover:underline font-bold text-base ${isDark? 'text-customWhite':'text-customBlack'}`} to={`/main/@/${accountForm.nickName}`}>{accountForm.nickName}</Link>
                                    </div>

                                <div className='leading-5 whitespace-pre-wrap'>
                                    <h1>{accountForm.email}</h1>
                                </div>
                                </div>
                        </AccountItem>
                    </div>




                    </TransitionDiv>
                  
                ))
    }
    </div>
    :
    null
);
}



export default Followholder;