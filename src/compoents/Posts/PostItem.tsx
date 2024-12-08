import React, {ReactNode, useEffect} from 'react';
import { userPost } from '../../store/types';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import PostTool from './PostTool';
import { Link, useNavigate } from 'react-router-dom';
import ProfileContainer from '../ProfileContainer';
import HoverBackground from '../HoverBackground';
import Services from '../../store/ApiService';
import useModal from '../../customHook/useModal';
import PostNestRe from '../Posts/PostNestRe';
import ContentSlider from '../Posts/ContentSlider';

interface typeOfPostItem {
  postInfo:userPost,
  isDark:boolean
}

const PostItem =({postInfo,isDark}:typeOfPostItem) => {
  const navigate = useNavigate()
const tools = [
    {type:'like',value:{numberValue:postInfo.numberOfLike,isLike:postInfo.isLike}},
    {type:'reply',value:{numberValue:postInfo.numberOfLike}},
    {type:'edit',value:null},
    {type:'delete',value:null},
];

const { AuthService, UserService,SocialService } = Services;
const { openModal } = useModal()

const boardLikeMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.boardlikeContents, {
     
    onSuccess: (data) => {
      console.log('좋아요 또는 좋아요 취소 완료', data);
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
    console.log(error)
      alert('좋아요 또는 좋아요 취소 오류발생')
    }
  });

  const boardUnLikeMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.boardunlikeContents, {
     
    onSuccess: (data) => {
      console.log('좋아요 또는 좋아요 취소 완료', data);
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('좋아요 또는 좋아요 취소 오류발생')
    }
  });


  const replyLikeMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.replylikeContents, {
     
    onSuccess: (data) => {
      console.log('좋아요 또는 좋아요 취소 완료',data);
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('좋아요 또는 좋아요 취소 오류발생')
    }
  });

  const replyUnLikeMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.replyunlikeContents, {
     
    onSuccess: (data) => {
      console.log('좋아요 또는 좋아요 취소 완료', data);
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('좋아요 또는 좋아요 취소 오류발생')
    }
  });

  function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log('clicked!')
    event.preventDefault(); // 기본 동작 방지
    event.stopPropagation(); // 이벤트 버블링 방지

    try{
    if(postInfo.typeOfPost === 'board' && isNumber(postInfo.bno)){
        console.log('board!')
        if(postInfo.isLike){
            console.log('isLike!')
            boardUnLikeMutation.mutate(postInfo!.bno);
        }else{
            console.log('isLike true!')
            boardLikeMutation.mutate(postInfo!.bno);
        }    
    }else if(postInfo.typeOfPost === 'reply' && isNumber(postInfo.rno) 
    ||  postInfo.typeOfPost === 'nestRe' && isNumber(postInfo.rno)
    ){ // reply
        console.log('reply!')
        if(postInfo.isLike){
            replyUnLikeMutation.mutate(postInfo.rno);
        }else{
            replyLikeMutation.mutate(postInfo.rno);
        } 
    }else{
        throw new Error('typePost is not on type define')
    }
    }
    catch(error:any){
        console.error("An error occurred:", error.message);
    }
    return
  };


  const openDetailPost = ()=>{
    openModal({ type:'detailPost', props: { isPotal:false,isForce:true,value:{postInfo},modal:{width:'w-11/12',height:'h-5/6',navButtonOption:{isClose:true}}} });
    // openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
  }

  const handleToDetailPage = ()=>{
    navigate(`/main/@/${postInfo.nickName}/post/${postInfo.bno}`)
  }

return (
  postInfo.typeOfPost ==='board'?
    <div onClick={handleToDetailPage} className={`w-full flex no-underline border-b ${isDark?'border-customLightGray':'border-customGray'}`}>
        <div className='flex px-3 py-2 w-full'>
            <ProfileContainer profileImg={postInfo.profilePicture} nickName={postInfo.nickName}></ProfileContainer>
    
        <div className='w-full ml-3'>
            <div className='flex align-middle'>
                <Link className={`font-bold text-base no-underline ${isDark? 'text-customWhite':'text-customBlack'}`} to={`/main/@/${postInfo.nickName}`}>{postInfo.nickName}</Link>
            </div>

        <div className='my-1 leading-5 whitespace-pre-wrap'>
            <h1>{postInfo.contents}</h1>
            <div className='my-3'>
            <div className='max-h-430px'>
                <ContentSlider contentsValue={postInfo.boardImages} isDark={isDark}/>
            </div>
        </div>
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
    </div> 
    :
    <div className={`w-full flex no-underline border-b ${isDark?'border-customLightGray':'border-customGray'}`}>
     <div className='flex px-3 py-2 w-full'>
            <ProfileContainer profileImg={postInfo.profilePicture} nickName={postInfo.nickName}></ProfileContainer>
    
        <div className='w-full ml-3'>
            <div className='flex align-middle'>
                <Link className={`font-bold text-base no-underline ${isDark? 'text-customWhite':'text-customBlack'}`} to={`/main/@/${postInfo.nickName}`}>{postInfo.nickName}</Link>
            </div>

        <div className='my-1 leading-5 whitespace-pre-wrap'>
            <h1>{postInfo.contents}</h1>
            <div className='my-3'>
            <div className='max-h-430px'>
              {
                postInfo.commentImage !== null?
                <ContentSlider contentsValue={[postInfo.commentImage]} isDark={isDark}/>
                :
                null
              }      
            </div>
        </div>
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
          {postInfo.typeOfPost === 'reply' && postInfo.numberOfComments >= 0 ?
          <PostNestRe numberOfComment={postInfo.numberOfComments} rno={postInfo.rno}></PostNestRe>
          :
          null}
        </div>
        </div>
</div> 

);
}



export default PostItem;