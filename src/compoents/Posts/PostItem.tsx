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
import {CLIENTURL} from '../../store/axios_context';

interface typeOfPostItem {
  postInfo?:userPost,
  isDark:boolean,
  isConnected?:boolean
}

const PostItem =({postInfo,isDark,isConnected=false}:typeOfPostItem) => {
const navigate = useNavigate();


const { AuthService, UserService,SocialService } = Services;
const { openModal } = useModal()
const userInfo = useSelector((state:RootState) => state.loginUserInfo);
const [fetchedUser,setFetchedUser]=useState<undefined|fetchedUserInfo>(undefined);

const tools = [
  // Reply 조건
  ...(postInfo?.typeOfPost === 'board' && postInfo?.isReplyAllowed === false || postInfo?.typeOfPost === 'nestRe'
    ? [] // Reply 제외
    : [
        {
          type: 'reply',
          value: { numberValue: postInfo?.numberOfComments },
        },
      ]
  ),

  // Like 조건
  ...(postInfo?.typeOfPost === 'board' && postInfo?.isLikeVisible === false
    ? [
        {
          type: 'like',
          value: {
            numberValue: userInfo?.nickName === postInfo?.nickName // isOwned condition
              ? postInfo?.numberOfLike
              : null,
            isLike: postInfo?.isLike,
          },
        },
      ]
    : [
        {
          type: 'like',
          value: {
            numberValue: postInfo?.numberOfLike,
            isLike: postInfo?.isLike,
          },
        },
      ]
  ),

  // Link Copy는 항상 포함
  { type: 'linkCopy', value: {} },
];

const handleCopyLink = (linkToCopy:string) => {
  // 브라우저가 Clipboard API를 지원하는지 확인
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(linkToCopy)
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다!');
      })
      .catch((err) => {
        console.error('복사 실패: ', err);

      });
  } else {
    // (옵션) Clipboard API가 지원되지 않을 때의 폴백
    alert('해당 브라우저는 클립보드 복사 기능을 지원하지 않습니다.');
  }
};


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
  const Idnumber = `${postInfo?.typeOfPost === 'board' ? `${postInfo?.typeOfPost}:${postInfo.bno}` : `${postInfo?.typeOfPost}:${postInfo?.rno}`}`


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
        openModal({ type:'createPost', props: { isPotal:false,isForce:false,value:{postInfo:postInfo,mode:'reply',profileImage:userInfo?.profilePicture,username:userInfo?.nickName},modal:{width:'w-11/12',height:'auto'}} });
      }
      else if(type === 'postMenu'){
        const username = userInfo?.nickName;
        const isOwned = username === postInfo.nickName;
        const typeOfPostInfo = postInfo.typeOfPost;
        const exampleFormat = [
          ...(isOwned
            ? [
                { type: 'edit', value: '편집하기' },
                ...(postInfo.typeOfPost === 'board'
                  ? [
                    { type: 'linkCopy', value: '링크 복사' },

                    postInfo.isLikeVisible
                        ? { type: 'disableShowNumberOfLike', value: '좋아요 수 숨기기' }
                        : { type: 'ableShowNumberOfLike', value: '좋아요 수 보이기' },
        
                        postInfo.isReplyAllowed
                        ? { type: 'disableComment', value: '댓글 비허용' }
                        : { type: 'ableComment', value: '댓글 허용' },
                    ]
                  : []
                ),
        
                { type: 'delete', value: '삭제하기' },
              ]
            : [
              // isOwner가 false일 때
              // typeOfPost가 board인 경우만 '링크 복사' 노출하고, 아닌 경우는 아무것도 추가 X
              ...(postInfo.typeOfPost === 'board'
                ? [{ type: 'linkCopy', value: '링크 복사' }]
                : []
              ),
              postInfo.isFollowing
                ? { type: 'unfollow', value: '언 팔로우하기' }
                : { type: 'follow', value: '팔로우하기' },
            ]
          )
        ];
        openModal({ type:'Popup', props: { isPotal:true,typeOfPopup:'postMenu', potalSpot:`postMenu${Idnumber}`,value:{boardInfo:postInfo,format:exampleFormat,locationValue:`${postInfo.typeOfPost==='nestRe'?'480px':'560px'}`}} });
      }
      else if(type === 'linkCopy'){
        const format = [{ type: 'linkCopy', value: '링크 복사' }] 
        openModal({ type:'Popup', props: { isPotal:true,typeOfPopup:'postMenu', potalSpot:`postToolShare${Idnumber}linkCopy`,value:{boardInfo:postInfo,format:format,locationValue:'none'}} });
        // const URL = (`${CLIENTURL}main/@/${postInfo.nickName}/post/${postInfo.bno}`)
        // handleCopyLink(URL);
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

                {isConnected?
                null
                :       
                <div>
                    <HoverBackground px='px-2' py='py-2'>
                        <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={{type:'postMenu',value:null}}></PostTool>
                    </HoverBackground>
                    <div className='absolute w-full' id={`postMenu${Idnumber}`}></div>
                </div>
                }

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
          {isConnected ? null : (
            <div className='flex text-customGray w-full mr-3'>
              {tools.map((tool, index) => (
                <div key={index} className='relative'>
                  <HoverBackground px='px-3' py='py-1'>
                    <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={tool} />
                  </HoverBackground>
                  {
                    tool.type==='linkCopy'? <div className='absolute w-full' id={`postToolShare${Idnumber}linkCopy`}></div>:null
                  }
                </div>
              ))}
            </div>
          )}
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
                {isConnected ? null : 
                <div>
                    <HoverBackground px='px-2' py='py-2'>
                        <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={{type:'postMenu',value:null}}></PostTool>
                    </HoverBackground>
                    <div className='absolute w-full' id={`postMenu${Idnumber}`}></div>
                </div>}
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
         {tools.map((tool, index) => (
                <div key={index} className='relative'>
                  <HoverBackground px='px-3' py='py-1'>
                    <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={tool} />
                  </HoverBackground>
                  {
                    tool.type==='linkCopy'? <div className='absolute w-full' id={`postToolShare${Idnumber}linkCopy`}></div>:null
                  }
                </div>
              ))}
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