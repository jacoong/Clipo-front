import React, {ReactNode,useEffect,useState} from 'react';
import { useTheme } from '../../../customHook/useTheme';
import TypeOfValuesPosts from '../../../pages/pageModule/pageKit/TypeOfValuesPosts';

type typeOfFilterType ='Following'|'Follower';

interface TypeFollowPopup{
    bno:number,
    username:string
}

const LikedUser =({value}:any) => {
    const {bno,username}:TypeFollowPopup = value;
    const TYPEOFVALUES:typeOfFilterType[] = ['Follower','Following'];
    const { isDark } = useTheme();
    console.log(value);


return (
    <div className='h-116 flex flex-col relative'>
        <div className='flex-1 overflow-auto'>
        <TypeOfValuesPosts typeOfFilter={'LikedUser'} username={username} bno={bno}></TypeOfValuesPosts>
        </div>
    </div>
);
}



export default LikedUser;