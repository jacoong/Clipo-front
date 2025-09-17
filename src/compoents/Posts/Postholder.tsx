import React, {ReactNode,useEffect} from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';
import { Border_color_Type } from '../../store/ColorAdjustion';
import TransitionDiv from '../TransitionDiv';
import Loading from '../Loading';
import PostItemSkeleton from '../skeleton/PostItemSkeleton';
import NoNumberLoad from '../NoNumberLoad';
import { VscCommentDraft } from "react-icons/vsc";
const Postholder =({fetchedPosts,isDark}:{ fetchedPosts: userPost[]|null,isDark:boolean }) => {


      

    
const generateRandomNumber = () =>{
    const min = 10000;
    const max = 99999;
    const newRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min; 
    return newRandomNumber
}

useEffect(()=>{
    if(fetchedPosts){
        console.log(fetchedPosts)
    }
},[fetchedPosts])

return (
    fetchedPosts?
    fetchedPosts.length > 0 ?
    <div className=''>
    {
        fetchedPosts.map((post,index)=>(
        <div key={`${generateRandomNumber()}${index}`}>
            <div className={`${post.typeOfPost === 'nestRe' ? 'py-2' : 'border-b'} ${Border_color_Type(isDark)}`}key={`${index}`}>
                <PostItem index={index} isDark={isDark} postInfo={post}/>
            </div>
        </div>

    ))
    }
    </div>: 
     <NoNumberLoad
     title="댓글이 없습니다"
     description={'이 게시물의 댓글이 없습니다.\n당신이 처음으로 댓글을 작성해보세요.'}
     isDark={isDark}
     icon={
       <VscCommentDraft ></VscCommentDraft>
     }
   />
    :
    <>
    <PostItemSkeleton isDark={isDark} />
    <PostItemSkeleton isDark={isDark} />
    <PostItemSkeleton isDark={isDark} />
    <PostItemSkeleton isDark={isDark} />
    <PostItemSkeleton isDark={isDark} />
    <PostItemSkeleton isDark={isDark} />
    </>

);
}



export default Postholder;