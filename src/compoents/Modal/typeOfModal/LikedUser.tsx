import React, {ReactNode,useEffect,useState} from 'react';
import { useTheme } from '../../../customHook/useTheme';
import PageNationStandard from '../../../pages/pageModule/pageKit/PageNationStandard.tsx';
import NoNumberLoad from '../../../compoents/NoNumberLoad';
import { MdFavorite } from 'react-icons/md';

interface TypeFollowPopup{
    bno:number,
    username:string
}

interface LikedUserProps {
    value: TypeFollowPopup;
    isFullScreen?: boolean;
}

const LikedUser =({value,isFullScreen = false}:LikedUserProps) => {
    const {bno,username} = value;
    const { isDark } = useTheme();
    console.log(value);

    const containerClass = `${isFullScreen ? 'min-h-screen' : 'h-116'} flex flex-col relative`;


return (
    <div className={containerClass}>
        <div className='flex-1 overflow-auto'>
        <PageNationStandard 
          typeOfFilter={'LikedUser'} 
          username={username} 
          bno={bno}
          emptyStateComponent={
            <NoNumberLoad 
              title={'좋아요한 사용자가 없습니다'}
              description={'아직 좋아요한 사용자가 없습니다.'}
              isDark={isDark}
              icon={<MdFavorite />}
            />
          }
        ></PageNationStandard>
        </div>
    </div>
);
}



export default LikedUser;
