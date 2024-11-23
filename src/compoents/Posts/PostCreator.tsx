import React, {ReactNode} from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';
import Button from '../../compoents/Button';
import ProfileContainer from '../ProfileConainer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';

interface PostCreatorProps {
    isDark: boolean;
  }

const PostCreator =({isDark}:PostCreatorProps) => {

    const userInfo = useSelector((state:RootState) => state.loginUserInfo);

    console.log(userInfo,'!!')

return (
    <div className={`w-full  p-4 h-auto border-b-customLightGray border-b ${isDark?'border-customLightGray':'border-customGray'}`}>
    <div className='w-full m-auto flex items-center'>
        <ProfileContainer 
        profileImg={userInfo !== null ?userInfo.profilePicture:null} 
        nickName={userInfo !== null ?userInfo.nickName:null}></ProfileContainer>
        <div className='w-full'>
        <p className='ml-3'>스레드를 시작하세요...</p>
        </div>
        <div>
        <Button width='60px' padding='5px'>게시</Button>
        </div>
    </div>
    </div>
);
}



export default PostCreator;