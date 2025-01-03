import React, {ReactNode,useState,useEffect} from 'react';
import { userPost,fetchedUserInfo } from '../../store/types';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


interface typeOfPostItem {
  postInfo?:userPost,
  isDark:boolean,
  isConnected?:boolean
}

const PostItem =({postInfo,isDark,isConnected=false}:typeOfPostItem) => {
const navigate = useNavigate()
const tools = [
    {type:'like',value:{numberValue:postInfo?.numberOfLike,isLike:postInfo?.isLike}},
    {type:'reply',value:{numberValue:postInfo?.numberOfLike}},
    {type:'edit',value:null},
    {type:'delete',value:null},
];

const { AuthService, UserService,SocialService } = Services;
const { openModal } = useModal()
const userInfo = useSelector((state:RootState) => state.loginUserInfo);
const [fetchedUser,setFetchedUser]=useState<undefined|fetchedUserInfo>(undefined);

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
  // const checkRelationOfUser = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.fetchedUserInfo, {
  //   onSuccess: (data) => {
  //     const username = userInfo?.nickName;
  //     const result = data.data.body;
  //     console.log('checkRelationOfUser:', data);
  //     const isOwned = username === result.nickName;
  //       openModal({ type:'Popup', props: { isPotal:true,typeOfPopup:'postMenu', potalSpot:`postMenu${Idnumber}`,value:{boardInfo:postInfo,isOwner:isOwned,stateOfFollow:result.isFollowing}} });
  //     setFetchedUser(data.data.body)
  //   },
  //   onError: (error:AxiosError) => {
  //     alert(error.response?.data ||'fetchedUserInfo실패');
  //   }
  // });


  function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}
  const Idnumber = `${postInfo?.typeOfPost === 'board' ? `bno:${postInfo.bno}` : `rno:${postInfo?.rno}`}`


  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>,type:string) => {
    console.log('clicked!')
    event.preventDefault(); // 기본 동작 방지
    event.stopPropagation(); // 이벤트 버블링 방지
    if(postInfo){
      if(type === 'like'){
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
      }
      else if(type === 'reply'){
        openModal({ type:'createPost', props: { isPotal:false,isForce:false,value:{postInfo:postInfo,profileImage:userInfo?.profilePicture,username:userInfo?.nickName},modal:{width:'w-11/12',height:'auto'}} });
      }
      else if(type === 'postMenu'){
        const username = userInfo?.nickName;
        const isOwned = username === postInfo.nickName;
        openModal({ type:'Popup', props: { isPotal:true,typeOfPopup:'postMenu', potalSpot:`postMenu${Idnumber}`,value:{boardInfo:postInfo,isOwner:isOwned,stateOfFollow: isOwned ? false : postInfo.isFollowing}} });
      }
    }else{
      return
    }
  };


  const openDetailPost = ()=>{
    openModal({ type:'detailPost', props: { isPotal:false,isForce:true,value:{postInfo},modal:{width:'w-11/12',height:'h-5/6',navButtonOption:{isClose:true}}} });
    // openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
  }

  const handleToDetailPage = ()=>{
    if(postInfo){
      navigate(`/main/@/${postInfo.nickName}/post/${postInfo.bno}`)
    }else{
      return
    }
  }



return (
  postInfo?
  postInfo.typeOfPost ==='board'?
    <div key={`${postInfo.bno}${postInfo.typeOfPost}`} onClick={handleToDetailPage} className={`relative w-full flex`}>
        <div className='flex px-3 py-2 w-full'>
            <ProfileContainer profileImg={postInfo.profilePicture} nickName={postInfo.nickName}></ProfileContainer>

        {isConnected?
                <div className='absolute top-8 flex justify-center h-full w-10'>
                <div className={`rounded-xl h-5/6 w-1 my-auto ${isDark?'bg-customLightGray':'bg-customGray'}`}></div>
              </div>
        :null}

        <div className=' mx-3 w-full'>
            <div className='flex w-full relative item-center justify-between'>
                <div>
                <Link className={`font-bold text-base`} to={`/main/@/${postInfo.nickName}`}>{postInfo.nickName}</Link>
                <h1>{postInfo.contents}</h1>
                </div>
                <div>
                    <HoverBackground px='px-2' py='py-2'>
                        <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={{type:'postMenu',value:null}}></PostTool>
                    </HoverBackground>
                    <div className='absolute w-full' id={`postMenu${Idnumber}`}></div>
                </div>

            </div>

        <div className='my-1 leading-5 whitespace-pre-wrap'>
            <div className='my-3'>
            <div className='max-h-430px'>
            {
                postInfo.boardImages?
                <ContentSlider contentsValue={postInfo.boardImages} isDark={isDark}/>
                :
                null
              }  
            </div>
        </div>
        </div>
        {isConnected?
         null
        :
        <div className='flex text-customGray w-full mr-3'>
        {
            tools.map(tool=>(
                <HoverBackground px='px-3' py='py-1'>
                    <PostTool handleOnClick={handleOnClick}isDark={isDark} typeOfTool={tool}></PostTool>
                </HoverBackground>
            ))
        }
      </div>
        }

        </div>
        </div>
    </div> 
    :
    <div  key={`${postInfo.bno}${postInfo.typeOfPost}`}className={`w-full flex relative`}>
     <div className='flex px-3 py-2 w-full'>
            <ProfileContainer profileImg={postInfo.profilePicture} nickName={postInfo.nickName}></ProfileContainer>
    

            {isConnected?
                <div className='absolute top-8 flex justify-center h-full w-10'>
                <div className={`rounded-xl h-5/6 w-1 my-auto ${isDark?'bg-customLightGray':'bg-customGray'}`}></div>
              </div>
        :null}


    <div className=' mx-3 w-full'>
            <div className='flex w-full relative item-center justify-between'>
                <div>
                <Link className={`font-bold text-base`} to={`/main/@/${postInfo.nickName}`}>{postInfo.nickName}</Link>
                <h1>{postInfo.contents}</h1>
                </div>
                <div>
                    <HoverBackground px='px-2' py='py-2'>
                        <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={{type:'postMenu',value:null}}></PostTool>
                    </HoverBackground>
                    <div className='absolute w-full' id={`postMenu${Idnumber}`}></div>
                </div>

            </div>
 

        <div className='my-1 leading-5 whitespace-pre-wrap'>
            <div className='my-3'>
            <div className='max-h-430px'>
              {
                postInfo.commentImage?
                <ContentSlider contentsValue={[postInfo.commentImage]} isDark={isDark}/>
                :
                null
              }      
            </div>
        </div>
        </div>
        {isConnected?
         null
        :
        <>
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
          </>
        }

        </div>
        </div>
    </div>   
  :
  <></>
);
}



export default PostItem;