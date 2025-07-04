import React, {ReactNode} from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';
import Button from '../../compoents/Button';
import ProfileContainer from '../ProfileContainer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import useModal from '../../customHook/useModal';
import { Border_color_Type } from '../../store/ColorAdjustion';

interface PostCreatorProps {
    isDark: boolean;
  }

const PostCreator =({isDark}:PostCreatorProps) => {
    const { openModal } = useModal();
    const userInfo = useSelector((state:RootState) => state.loginUserInfo);

    const openPost = () =>{
        const postInfoForm = {email:userInfo?.email,nickName:userInfo?.nickName,profilePicture:userInfo?.profilePicture}
        openModal({ type:'createPost', props: { isModalLayer:false,isForce:false,isDark:isDark,value:{postInfo:postInfoForm,mode:'create',},modal:{width:'w-104'}} });
        return
    }

    console.log('userInfo',userInfo)

return (
    userInfo?
    <div className={`w-full  p-4 h-auto border-b ${Border_color_Type(isDark)}`}>
    <div className='w-full m-auto flex items-center'>
        <ProfileContainer 
        profileImg={userInfo.profilePicture} 
        nickName={userInfo.nickName}></ProfileContainer>
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