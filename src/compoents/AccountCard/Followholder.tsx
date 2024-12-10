import React, {ReactNode,useEffect} from 'react';
import AccountItem from './AccountItem';
import {UserInfo} from '../../store/types';
const Followholder =({accountInfo,isDark}:{ accountInfo:UserInfo[],isDark:boolean }) => {

    console.log(accountInfo)
return (
    accountInfo.length>0?
    <div className=''>
    {
                   accountInfo.map((accountForm:UserInfo,index:any)=>(
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