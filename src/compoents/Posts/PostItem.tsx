import React, {ReactNode,useState,useEffect,useRef} from 'react';
import { userPost,fetchedUserInfo } from '../../store/types';
import { useMutation, useQuery } from "react-query";
import { AxiosError } from 'axios';
import PostTool from './PostTool';
import { Link, useNavigate } from 'react-router-dom';
import ProfileContainer from '../ProfileContainer';
import HoverBackground from '../HoverEventCompoents/HoverBackground';
import Services from '../../store/ApiService';
import useModal from '../../customHook/useModal';
import PostNestRe from '../Posts/PostNestRe';
import ContentSlider from '../Posts/ContentSlider';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {CLIENTURL} from '../../store/axios_context';
import {useQueryClient} from 'react-query';
import { BiBody } from 'react-icons/bi';
import { useFlashMessage } from '../../customHook/useFlashMessage';
import { closeModal } from '../../store/modalSlice';
import PageNationStandard from '../../pages/pageModule/pageKit/PageNationStandard.tsx';
import UserAccount from './UserAccount'
interface typeOfPostItem {
  postInfo?:userPost,
  isDark:boolean,
  isConnected?:boolean,
  isDetailPost?:boolean,
  index?:number
}

const PostItem =({postInfo,isDark,isConnected=false,isDetailPost=false}:typeOfPostItem) => {
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const [popupVisible, setpopupVisible] = useState(true);
const navigate = useNavigate();
const queryClient =  useQueryClient();
const { AuthService, UserService,SocialService } = Services;
const { openModal,closeModal } = useModal()
const userInfo = useSelector((state:RootState) => state.loginUserInfo);
const [fetchedUser,setFetchedUser]=useState<undefined|fetchedUserInfo>(undefined);
const {flashMessage,showFlashMessage} = useFlashMessage();
const triggerDivRefs = useRef<Record<string, HTMLDivElement | null>>({});
const triggerId = postInfo ? `${postInfo.typeOfPost}:${postInfo.bno ?? postInfo.rno}`:'fetchIdOfPostItem'; // 고유 ID

const { data, isLoading, isError, error } = useQuery(['fetchDetailBoardInfo',postInfo?.bno],()=>SocialService.fetchedBoard(String(postInfo?.bno)),
{
  enabled: !!postInfo?.bno && (postInfo?.typeOfPost === 'nestRe' || postInfo?.typeOfPost === 'reply'), // bnoValue가 존재할 때만 실행
  staleTime: 1000 * 60 * 5, // 5분 동안 데이터가 신선하다고 간주
  cacheTime: 1000 * 60 * 10, // 10분 동안 캐시에 데이터 유지
  onError: (error: AxiosError) => {
    console.error('Error fetching board data:', error.message);
  },
}
)

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

useEffect(() => {
  console.log('👀 triggerId =', triggerId);
  console.log('📌 refs =', triggerDivRefs.current);
}, [triggerId]);


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
  onMutate: async (postId:number) => {
    await queryClient.getQueryData(['fetchPosts', 'MainRandom']);
    const prevInfiniteData = queryClient.getQueryData(['fetchPosts', 'MainRandom']);
    const preDetailData = queryClient.getQueryData(['fetchDetailBoardInfo', postId]);

    queryClient.setQueryData(['fetchPosts', 'MainRandom'], (oldPost: any) => {
      if (!oldPost) return oldPost;
      return {
        ...oldPost,
        pages: oldPost.pages.map((page: any) => {
          return {
            ...page,
            body: {
              ...page.body,
              data:page.body.data.map((post: any) => {
                if (post.bno === postId) {
                  // 좋아요 상태와 좋아요 수만 변경
                  return {
                    ...post,
                    isLike: true,
                    numberOfLike: post.numberOfLike + 1,
                  };
                }
                return post;
            }),
          }
          };
        }),
      };
    });
    if(preDetailData){
      queryClient.setQueryData(['fetchDetailBoardInfo', postId], (oldPost: any) => {
        if (!oldPost) return oldPost;
        const { data } = oldPost; // oldPost에서 data 추출
        const { body } = data; // data에서 body 추출
        return {
          ...oldPost,
          data:{
          ...data,
          body:{
            ...body, // 기존 body 유지
            isLike: true, // isLike 상태 변경
            numberOfLike: body.numberOfLike + 1, // 좋아요 수 증가
          }
          }
        };
      });
    }
  

      return { prevInfiniteData,preDetailData };
  },
    onSuccess: (data,postId) => {
      console.log('좋아요 또는 좋아요 취소 완료', data);
    },
    onError: (error:AxiosError, postId: number, context:any) => {
      if (context?.prevInfiniteData) {
        showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Liked failed'})
        queryClient.setQueryData(['fetchPosts', 'MainRandom'], context.prevInfiniteData);
        queryClient.setQueryData(['fetchDetailBoardInfo', postId], context.preDetailData);
      }
    },
    onSettled:(postId)=>{
      queryClient.invalidateQueries(['fetchPosts', 'MainRandom'])
    }
  });

  const boardUnLikeMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.boardunlikeContents, {
    onMutate: async (postId:number) => {
      await queryClient.getQueryData(['fetchPosts', 'MainRandom']);
      const prevInfiniteData = queryClient.getQueryData(['fetchPosts', 'MainRandom']);
      const preDetailData = queryClient.getQueryData(['fetchDetailBoardInfo', postId]);

      queryClient.setQueryData(['fetchPosts', 'MainRandom'], (oldPost: any) => {
        if (!oldPost) return oldPost;
        return {
          ...oldPost,
          pages: oldPost.pages.map((page: any) => {
            return {
              ...page,
              body: {
                ...page.body,
                data:page.body.data.map((post: any) => {
                  if (post.bno === postId) {
                    // 좋아요 상태와 좋아요 수만 변경
                    return {
                      ...post,
                      isLike: false,
                      numberOfLike: post.numberOfLike - 1,
                    };
                  }
                  return post;
              }),
            }
            };
          }),
        };
      });

      if(preDetailData){
        queryClient.setQueryData(['fetchDetailBoardInfo', postId], (oldPost: any) => {
          if (!oldPost) return oldPost;
          const { data } = oldPost; // oldPost에서 data 추출
          const { body } = data; // data에서 body 추출
          return {
            ...oldPost,
            data:{
            ...data,
            body:{
              ...body, // 기존 body 유지
              isLike: false, // isLike 상태 변경
              numberOfLike: body.numberOfLike - 1, // 좋아요 수 증가
            }
            }
          };
        });
      }

        return { prevInfiniteData,preDetailData };
    },
    onSuccess: (data,postId) => {
      console.log('좋아요 또는 좋아요 취소 완료', data);

    },
    onError: (error:AxiosError, postId: number, context:any) => {
      if (context?.prevInfiniteData) {
        showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Liked failed'})
        queryClient.setQueryData(['fetchPosts', 'MainRandom'], context.prevInfiniteData);
        queryClient.setQueryData(['fetchDetailBoardInfo', postId], context.preDetailData);
      }
    },
  });
  const replyLikeMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.replylikeContents, {
    onMutate: async (replyId:number) => {
      if(postInfo){
        const bno = postInfo.bno;
        const parentRno = postInfo.parentRno;
        const preReplyData = queryClient.getQueryData(['fetchPosts','Reply',bno]);
        const preNestReData = queryClient.getQueryData(['fetchPosts', 'NestRe',parentRno]); // reply

        if(preReplyData){
          queryClient.setQueryData(['fetchPosts', 'Reply',bno], (oldPost: any) => {
            if (!oldPost) return oldPost;
            return {
              ...oldPost,
              pages: oldPost.pages.map((page: any) => {
                return {
                  ...page,
                  body:{
                    ...page.body,
                    data:page.body.data.map((post: any) => {
                      if (post.rno === replyId) {
                        // 좋아요 상태와 좋아요 수만 변경
                        return {
                          ...post,
                          isLike: true,
                          numberOfLike: post.numberOfLike + 1,
                        };
                      }
                      return post;
                    }),
                  }
                };
              }),
            };
          });
        }
        if(preNestReData){
      
          queryClient.setQueryData(['fetchPosts', 'NestRe',parentRno], (oldPost: any) => {
            if (!oldPost) return oldPost;
            console.log('fetchPostsnest',oldPost)
            return {
              ...oldPost,
              pages: oldPost.pages.map((page: any) => {
                return {
                  ...page,
                  body:{
                    ...page.body,
                    data:page.body.data.map((post: any) => {
                      if (post.rno === replyId) {
                        // 좋아요 상태와 좋아요 수만 변경
                        return {
                          ...post,
                          isLike: true,
                          numberOfLike: post.numberOfLike + 1,
                        };
                      }
                    return post;
                  }),
                }
              }
              }),
            };
          });
        }
        return { preReplyData,bno,preNestReData};
      }
      },
      onSuccess: (data) => {

        console.log('좋아요 또는 좋아요 취소 완료', data);
      },
      onError: (error:AxiosError, postId: number, context:any) => {
        if (context?.prevInfiniteData) {
          showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Liked failed'})
          queryClient.setQueryData(['fetchPosts', 'Reply',context.bno], context.preReplyData);
        }
      },
  });
  const replyUnLikeMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.replyunlikeContents, {
    onMutate: async (replyId:number) => {
    if(postInfo){
      const bno = postInfo.bno;
      const parentRno = postInfo.parentRno;
      const preReplyData = queryClient.getQueryData(['fetchPosts','Reply',bno]);
      const preNestReData = queryClient.getQueryData(['fetchPosts', 'NestRe',parentRno]); // reply

      if(preReplyData){
        queryClient.setQueryData(['fetchPosts', 'Reply',bno], (oldPost: any) => {
          if (!oldPost) return oldPost;
          return {
            ...oldPost,
            pages: oldPost.pages.map((page: any) => {
              return {
                ...page,
                body:{
                  ...page.body,
                  data:page.body.data.map((post: any) => {
                    if (post.rno === replyId) {
                      // 좋아요 상태와 좋아요 수만 변경
                      return {
                        ...post,
                        isLike: false,
                        numberOfLike: post.numberOfLike - 1,
                      };
                    }
                    return post;
                }),
              }
            }
          })
        }
        });
      }

      if(preNestReData){
        queryClient.setQueryData(['fetchPosts', 'NestRe',parentRno], (oldPost: any) => {
          if (!oldPost) return oldPost;
          console.log('fetchPostsnest',oldPost)
          return {
            ...oldPost,
            pages: oldPost.pages.map((page: any) => {
              return {
                ...page,
                body:{
                  ...page.body,
                  data:page.body.data.map((post: any) => {
                    if (post.rno === replyId) {
                      // 좋아요 상태와 좋아요 수만 변경
                      return {
                        ...post,
                        isLike: false,
                        numberOfLike: post.numberOfLike - 1,
                      };
                    }
                  return post;
                }),
              }
            }
            }),
          };
        });
      }
      
      return { preReplyData,bno};
    }
    },
    onSuccess: (data) => {
      console.log('좋아요 또는 좋아요 취소 완료', data);
    },
    onError: (error:AxiosError, postId: number, context:any) => {
      console.log(postId,context)
      if (context?.prevInfiniteData) {
        showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Liked failed'})
        queryClient.setQueryData(['fetchPosts', 'Reply',context.bno], context.preReplyData);
      }
    },
  });

  const  openLikedUser = (bno:number|undefined)=>{
    if(bno){
      openModal({ type:'likedUser', props: { isPotal:false,isForce:true,value:{bno:bno,username:userInfo?.nickName},modal:{width:'w-104',isCenterMessage:'좋아요 정보',navButtonOption:{isClose:true}}} });
    }else{
      showFlashMessage({typeOfFlashMessage:'error',title:'error',subTitle:'can not get board id when openLikedUser'})
    }
 
    // openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
  }


  function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}
 const Idnumber = `${postInfo?.typeOfPost === 'board' ? `${postInfo?.typeOfPost}:${postInfo.bno}` : `${postInfo?.typeOfPost}:${postInfo?.rno}`}`

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>,type:string,triggerId?:string) => {
    console.log('clicked!',type)
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
      else if(type === 'postMenu' && triggerId){
        console.log(triggerId)
        if(triggerId){
          console.log('run',triggerId);
          // if (!triggerRef.current) return;
          // const rect = triggerRef.current.getBoundingClientRect();
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
          const ref = triggerDivRefs.current[triggerId];
          if (!ref) return;
            const rect = ref.getBoundingClientRect();
            console.log(rect,'rect')
            openModal({ type:'Popup', props: { isPotal:true,typeOfPopup:'postMenu', potalSpot:{ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },value:{boardInfo:postInfo,format:exampleFormat,locationValue:`${postInfo.typeOfPost==='nestRe'?'480px':'560px'}`}} });
          }else{
            return console.log('passed')
          }
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
      const typeOfPost = postInfo.typeOfPost;
      if(typeOfPost === 'board'){
        navigate(`/main/@/${postInfo.nickName}/post/${postInfo.bno}`)
      }else{
        const bnoValue = postInfo.bno;
        if(bnoValue){
        navigate(`/main/@/${data.data.body.nickName}/post/${bnoValue}`)
        }
      }
    }else{
      return
    }
  }

  // const showUserAccount = (action:string)=>{
  //   if(action === 'open'){
  //     setTimeout(() => {
  //       openModal({ type:'Popup', props: { isPotal:true,typeOfPopup:'accountInfo', potalSpot:`accountInfo${Idnumber}`,value:{username:postInfo?.nickName,locationValue:'480px'}} });
  //     }, 2000);
  //   }else{
  //     // console.log('??')
  //     // setTimeout(() => {
  //     //   closeModal();
  //     // }, 1000);
  //   }
  // }




return (
  postInfo?
  postInfo.typeOfPost ==='board'?
  <>
    <div key={`${postInfo.bno}${postInfo.typeOfPost}`} onClick={handleToDetailPage} className={`relative w-full flex`}>
        <div className='flex flex-col px-4 items-center py-3 w-full'>


            <div className='flex w-full'>
         <ProfileContainer profileImg={postInfo.profilePicture} nickName={postInfo.nickName}></ProfileContainer>

        {isConnected?
                <div className='absolute top-8 flex justify-center h-full w-10'>
                <div className={`rounded-xl h-5/6 w-1 my-auto ${isDark?'bg-customLightGray':'bg-customGray'}`}></div>
              </div>
        :null}

        <div className=' mx-3 w-full'>
            <div className='flex w-full relative item-center justify-between'>
                <div className='flex flex-col justify-center '>
                <UserAccount username={postInfo.nickName} idNum={`${postInfo.typeOfPost === 'board' ? `${postInfo.typeOfPost}:${postInfo.bno}` : `${postInfo.typeOfPost}:${postInfo.rno}`}`}></UserAccount>

                {/* <Link 
                onMouseEnter={()=>{
                  showUserAccount('open')}}
                onMouseLeave={()=>{showUserAccount('close')}}
                onClick={(e) => {
                e.stopPropagation(); }} 
                className={`font-bold text-base hover:underline`} to={`/main/@/${postInfo.nickName}`}>{postInfo.nickName}</Link> */}




                {isDetailPost?null:<p className='text-sm'>{postInfo.contents}</p>}       
                </div>

                {isConnected?
                null
                :       
                <div
                ref={(el) => {
                  // 클릭 시점에 사용할 고유 ID
                  const id = `${postInfo.typeOfPost}:${postInfo.bno ?? postInfo.rno}`;
                  if (el && id) {
                    triggerDivRefs.current[id] = el;
                  } else if (!el && id) {
                    delete triggerDivRefs.current[id];
                  }
                }}
                onClick={(e) => {
                  if (!postInfo) return;
                  // 클릭 시점에 다시 계산
                  const id = `${postInfo.typeOfPost}:${postInfo.bno ?? postInfo.rno}`;
                  handleOnClick(e, 'postMenu', id);
                }}
              >
                    <HoverBackground>
                        <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={{type:'postMenu',value:null}}></PostTool>
                    </HoverBackground>
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
        isDetailPost?
        null
        :
        <div className='flex w-full mr-3'>
          {isConnected ? null : (
            <div className='flex w-full mr-3'>
              {tools.map((tool, index) => (
                <div key={index} className='relative'>
                  <HoverBackground px='pr-3' py='py-1'>
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
   
            <div className='w-full'>
            {
  isDetailPost && (
    <div>
      {/* Post Content */}
      <div>
        <p className='text-sm'>{postInfo.contents}</p>
      </div>

      {/* Tools Section */}
      <div className={`flex w-full mr-3" ${isDark ? 'border-b border-customLightGray' : 'border-b border-customGray'}`}>
        {tools.map((tool, index) => (
          <div key={index} className="relative">
            <HoverBackground px="pr-3" py="py-1">
              <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={tool} />
            </HoverBackground>
            {tool.type === 'linkCopy' && (
              <div className="absolute w-full" id={`postToolShare${Idnumber}linkCopy`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Reply and Like Section */}
      <div className='flex justify-between items-center pt-4'>
        <div><p>답글</p></div>
        <div className='cursor-pointer' onClick={()=>{openLikedUser(postInfo.bno)}}>좋아요 보기</div>
      </div>
    </div>
  )
}
    </div>

        </div>
   



        
    </div> 
   
    </>
    :
    <div  key={`${postInfo.bno}${postInfo.typeOfPost}`} onClick={handleToDetailPage} className={`w-full flex relative`}>
     <div className='flex px-3 py-2 w-full'>
            <ProfileContainer profileImg={postInfo.profilePicture} nickName={postInfo.nickName}></ProfileContainer>
    

            {isConnected?
                <div className='absolute top-8 flex justify-center h-full w-10'>
                <div className={`rounded-xl h-5/6 w-1 my-auto ${isDark?'bg-customLightGray':'bg-custmGray'}`}></div>
              </div>
        :null}


    <div className=' mx-3 w-full'>
            <div className='flex w-full relative item-center justify-between'>
                <div>
                {/* <Link 
                onMouseEnter={()=>{showUserAccount('open')}}
                onClick={(e) => {
                e.stopPropagation(); 
    }}className={`font-bold text-base`} to={`/main/@/${postInfo.nickName}`}>{postInfo.nickName}</Link> */}


<UserAccount username={postInfo.nickName} idNum={`${postInfo.typeOfPost === 'reply' ? `${postInfo.typeOfPost}:${postInfo.bno}` : `${postInfo.typeOfPost}:${postInfo.rno}`}`}></UserAccount>
                <p className='text-sm'>{postInfo.contents}</p>
                </div>
                {isConnected ? null : 
                <div>
                    <HoverBackground px='px-2' py='py-2'>
                        <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={{type:'postMenu',value:null}}></PostTool>
                    </HoverBackground>
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
        <div className='flex w-full mr-3 '>
         {tools.map((tool, index) => (
                <div key={index} className={`relative`}>
                  <HoverBackground px='pr-3' py='py-1'>
                    <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={tool} />
                  </HoverBackground>
                  {
                    tool.type==='linkCopy'? <div className='absolute w-full' id={`postToolShare${Idnumber}linkCopy`}></div>:null
                  }
                </div>
              ))}
          </div>
          {postInfo.typeOfPost === 'reply' && postInfo.numberOfComments > 0 ?
          <PageNationStandard numberOfComment={postInfo.numberOfComments} pagenationPage={'loadMore'}  bno={postInfo.bno} typeOfFilter={'NestRe'} rno={postInfo.rno}></PageNationStandard>
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