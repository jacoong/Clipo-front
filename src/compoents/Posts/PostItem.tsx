import React, {ReactNode} from 'react';
import { userPost } from '../../store/types';
import PostTool from './PostTool';
import { Link } from 'react-router-dom';
import ProfileContainer from '../ProfileConainer';
const PostItem =({postInfo,isDark}:{postInfo:userPost,isDark:boolean}) => {

const tools = [
    {type:'reply',value:postInfo.numberOfComments},
    {type:'like',value:postInfo.numberOfLike},
    {type:'edit',value:null},
    {type:'delete',value:null},
];
return (
    <Link className={`w-full flex no-underline border-b ${isDark?'border-customLightGray':'border-customGray'}`} to={`/main/@${postInfo.nickName}/status/${postInfo.bno}`}>
        <div className='flex p-4 w-full'>
            <ProfileContainer profileImg={postInfo.profilePicture} nickName={postInfo.nickName}></ProfileContainer>
    
        <div className='w-full ml-3'>
            <div className='flex align-middle'>
                <Link className={`font-bold text-base no-underline ${isDark? 'text-customWhite':'text-customBlack'}`} to={`/main/@/${postInfo.nickName}`}>{postInfo.nickName}</Link>
            </div>

        <div className='mt-2 leading-5 whitespace-pre-wrap'>
            <h1>{postInfo.contents}</h1>
        </div>
        <div className='flex h-4 text-customGray w-full mt-3 mr-3'>
            {
                tools.map(tool=>(
                    <PostTool typeOfTool={tool}></PostTool>
                ))
            }
                    </div>
        </div>
        </div>
    </Link> 
);
}



export default PostItem;