import React, {ReactNode,useEffect} from 'react';
import AccountItem from './AccountItem';
import {UserInfo} from '../../store/types';

interface AccountUserInfo extends Omit<UserInfo, 'nickName'> {
    nickName: string; // null이 아님
  }

const Followholder =({accountInfo,isDark}:{ accountInfo:AccountUserInfo[],isDark:boolean }) => {

    console.log(accountInfo)
return (
    accountInfo.length>0?
    <div className=''>
    {
                   accountInfo.map((accountForm:AccountUserInfo,index:any)=>(
                    <div key={`accountInfo${index}`}>
                        <AccountItem isDark={isDark} itemInfo={accountForm}/>
                    </div>
                ))
    }
    </div>
    :
    null
);
}



export default Followholder;