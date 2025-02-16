import React, {ReactNode} from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';
import Button from '../../compoents/Button';
import ProfileContainer from '../ProfileContainer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import useModal from '../../customHook/useModal';

interface PostCreatorProps {
    isDark: boolean;
  }

const PostCreator =({isDark}:PostCreatorProps) => {
    const { openModal } = useModal();
    const userInfo = useSelector((state:RootState) => state.loginUserInfo);

    const openPost = () =>{
        openModal({ type:'createPost', props: { isPotal:false,isForce:false,isDark:isDark,value:{profileImage:userInfo?.profilePicture,username:userInfo?.nickName,mode:'create',},modal:{width:'w-104'}} });
        return
    }

    console.log('userInfo',userInfo)

return (
    userInfo?
    <div className={`w-full  p-4 h-auto border-b ${isDark?'border-customLightGray':'border-customGray'}`}>
    <div className='w-full m-auto flex items-center'>
        <ProfileContainer 
        profileImg={userInfo.profilePicture} 
        nickName={userInfo !== null ?userInfo.nickName:null}></ProfileContainer>
        <div className='w-full cursor-text' onClick={openPost}>
        <p className='ml-3'>스레드를 시작하세요...</p>
        </div>
        <div>
        <Button handleClick={openPost} width='60px' padding='5px'>게시</Button>
        </div>
    </div>
    </div>
    :
    null
);
}



export default PostCreator;