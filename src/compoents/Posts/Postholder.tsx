import React, {useEffect,useRef} from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';
import { Border_color_Type } from '../../store/ColorAdjustion';
import PostItemSkeleton from '../skeleton/PostItemSkeleton';
import NoNumberLoad from '../NoNumberLoad';
import { VscCommentDraft } from "react-icons/vsc";
const Postholder =({
  fetchedPosts,
  isDark,
  scrollTargetId,
  targetReplyId,
  targetNestId,
  nestInitialPage
}:{
  fetchedPosts: userPost[]|null,
  isDark:boolean,
  scrollTargetId?: number;
  targetReplyId?: number;
  targetNestId?: number;
  nestInitialPage?: number;
}) => {


      
const targetRef = useRef<HTMLDivElement | null>(null);
const hasScrolledRef = useRef(false);
    
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

useEffect(() => {
  hasScrolledRef.current = false;
}, [scrollTargetId]);

useEffect(() => {
  if (scrollTargetId && targetRef.current && !hasScrolledRef.current) {
    targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    hasScrolledRef.current = true;
  }
}, [scrollTargetId, fetchedPosts]);

return (
    fetchedPosts?
    fetchedPosts.length > 0 ?
    <div className=''>
    {
        fetchedPosts.map((post,index)=>{
          const isTargetReply = targetReplyId != null && post.rno === targetReplyId;
          const shouldAttachTargetRef = scrollTargetId != null && post.rno === scrollTargetId;
          return(
        <div key={`${generateRandomNumber()}${index}`}>
            <div 
              className={`${post.typeOfPost === 'nestRe' ? 'py-2' : 'border-b'} ${Border_color_Type(isDark)}`}key={`${index}`}
              ref={shouldAttachTargetRef ? targetRef : undefined}
              id={shouldAttachTargetRef ? `post-rno-${post.rno}` : undefined}
            >
                <PostItem 
                  index={index} 
                  isDark={isDark} 
                  postInfo={post}
                  targetReplyId={targetReplyId}
                  targetNestId={isTargetReply ? targetNestId : undefined}
                  nestInitialPage={isTargetReply ? nestInitialPage : undefined}
                />
            </div>
        </div>
    )})
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
