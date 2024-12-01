import React, {ReactNode} from 'react';
import { userPost } from '../../store/types';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import PostTool from './PostTool';
import { Link } from 'react-router-dom';
import ProfileContainer from '../ProfileContainer';
import HoverBackground from '../HoverBackground';
import Services from '../../store/ApiService';
const PostItem =({postInfo,isDark}:{postInfo:userPost,isDark:boolean}) => {

const tools = [
    {type:'like',value:{numberValue:postInfo.numberOfLike,isLike:postInfo.isLike}},
    {type:'reply',value:{numberValue:postInfo.numberOfLike}},
    {type:'edit',value:null},
    {type:'delete',value:null},
];

const { AuthService, UserService,SocialService } = Services;

const postLikeMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.likeContents, {
     
    onSuccess: (data) => {
      console.log('좋아요 또는 좋아요 취소 완료', data);
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('좋아요 또는 좋아요 취소 오류발생')
    }
  });


  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log('clicked!')
    event.preventDefault(); // 기본 동작 방지
    event.stopPropagation(); // 이벤트 버블링 방지
    postLikeMutation.mutate(postInfo.bno);
    return
  };

return (
    <Link key={postInfo.bno} className={`w-full flex no-underline border-b ${isDark?'border-customLightGray':'border-customGray'}`} to={`/main/@${postInfo.nickName}/status/${postInfo.bno}`}>
        <div className='flex px-3 py-2 w-full'>
            <ProfileContainer profileImg={postInfo.profilePicture} nickName={postInfo.nickName}></ProfileContainer>
    
        <div className='w-full ml-3'>
            <div className='flex align-middle'>
                <Link className={`font-bold text-base no-underline ${isDark? 'text-customWhite':'text-customBlack'}`} to={`/main/@/${postInfo.nickName}`}>{postInfo.nickName}</Link>
            </div>

        <div className='my-1 leading-5 whitespace-pre-wrap'>
            <h1>{postInfo.contents}</h1>
        </div>
        <div className='flex text-customGray w-full mr-3'>
            {
                tools.map(tool=>(
                    <HoverBackground px='px-3' py='py-1'>
                        <PostTool handleOnClick={handleOnClick}isDark={isDark} typeOfTool={tool}></PostTool>
                    </HoverBackground>
                ))
            }
                    </div>
        </div>
        </div>
    </Link> 
);
}



export default PostItem;