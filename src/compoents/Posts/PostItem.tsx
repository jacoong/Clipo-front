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
import { Border_color_Type,Font_color_Type_1,Reverse_Bg_color_Type } from '../../store/ColorAdjustion';
import PostItemSkeleton from '../skeleton/PostItemSkeleton';
import CommentPageNation from '../../pages/pageModule/pageKit/CommentPageNation';
interface typeOfPostItem {
  postInfo?:userPost,
  isDark:boolean,
  isConnected?:boolean,
  isDetailPost?:boolean,
  index?:number,
  isClickable?:boolean
}

const PostItem =({isClickable=true,postInfo,isDark,isConnected=false,isDetailPost=false}:typeOfPostItem) => {
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const [popupVisible, setpopupVisible] = useState(true);
const userInfo = useSelector((state:RootState) => state.loginUserInfo);
const navigate = useNavigate();
const queryClient =  useQueryClient();
const { AuthService, UserService,SocialService } = Services;
const { openModal,closeModal } = useModal()
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
  { type: 'linkCopy', value: {
    postInfo:postInfo
  } },
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
  onMutate: async (postId:number) => {
    await queryClient.getQueryData(['fetchPosts', 'MainRandom']);
    const prevInfiniteData = queryClient.getQueryData(['fetchPosts', 'MainRandom']);
    const preDetailData = queryClient.getQueryData(['fetchDetailBoardInfo', postId]);

    // MainRandom 쿼리 업데이트
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

    // Post, Replies, Likes 쿼리들 업데이트 (username이 있는 경우)

    if (userInfo) {
      ['Post', 'Replies', 'Likes'].forEach(typeOfFilter => {
        const queryKey = ['fetchPosts', typeOfFilter, userInfo.nickName];
        const prevData = queryClient.getQueryData(queryKey);
        console.log('prevData',prevData)
        queryClient.setQueryData(queryKey, (oldPost: any) => {
          if (!oldPost) return oldPost;
          return {
            ...oldPost,
            pages: oldPost.pages.map((page: any) => {
              return {
                ...page,
                body: {
                  ...page.body,
                  data: page.body.data.map((post: any) => {
                    if (post.bno === postId) {
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
      });
    }

    // DetailBoardInfo 쿼리 업데이트
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
  

      return { prevInfiniteData, preDetailData };
  },
    onSuccess: (data,postId) => {
      queryClient.invalidateQueries(['fetchPosts', 'LikedUser'])
      console.log('좋아요 또는 좋아요 취소 완료', data);
    },
    onError: (error:AxiosError, postId: number, context:any) => {
      if (context?.prevInfiniteData) {
        showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Liked failed'})
        queryClient.setQueryData(['fetchPosts', 'MainRandom'], context.prevInfiniteData);
        queryClient.setQueryData(['fetchDetailBoardInfo', postId], context.preDetailData);
        
        // Post, Replies, Likes 쿼리들도 롤백
        const currentUser = queryClient.getQueryData(['currentUser']) as any;
        const username = currentUser?.username;
        if (username) {
          ['Post', 'Replies', 'Likes'].forEach(typeOfFilter => {
            const queryKey = ['fetchPosts', typeOfFilter, username];
            const prevData = queryClient.getQueryData(queryKey);
            if (prevData) {
              queryClient.setQueryData(queryKey, prevData);
            }
          });
        }
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


      if (userInfo) {
        ['Post', 'Replies', 'Likes'].forEach(typeOfFilter => {
          const queryKey = ['fetchPosts', typeOfFilter, userInfo.nickName];
          const prevData = queryClient.getQueryData(queryKey);
          console.log('prevData',prevData)
          queryClient.setQueryData(queryKey, (oldPost: any) => {
            if (!oldPost) return oldPost;
            return {
              ...oldPost,
              pages: oldPost.pages.map((page: any) => {
                return {
                  ...page,
                  body: {
                    ...page.body,
                    data: page.body.data.map((post: any) => {
                      if (post.bno === postId) {
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
        });
      }

        return { prevInfiniteData,preDetailData };
    },
    onSuccess: (data,postId) => {
      console.log('좋아요 또는 좋아요 취소 완료', data);
      queryClient.invalidateQueries(['fetchPosts', 'LikedUser'])

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


        if (userInfo) {
          ['Post', 'Replies', 'Likes'].forEach(typeOfFilter => {
            const queryKey = ['fetchPosts', typeOfFilter, userInfo.nickName];
            const prevData = queryClient.getQueryData(queryKey);
            console.log('prevData',prevData)
            queryClient.setQueryData(queryKey, (oldPost: any) => {
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
                }
                }),
              };
            });
          });
        }

        return { preReplyData,bno,preNestReData};
      }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(['fetchPosts', 'LikedUser'])
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

      if (userInfo) {
        ['Post', 'Replies', 'Likes'].forEach(typeOfFilter => {
          const queryKey = ['fetchPosts', typeOfFilter, userInfo.nickName];
          const prevData = queryClient.getQueryData(queryKey);
          console.log('prevData',prevData)
          queryClient.setQueryData(queryKey, (oldPost: any) => {
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
              }),
            };
          });
        });
      }
      
      return { preReplyData,bno};
    }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['fetchPosts', 'LikedUser'])
      console.log('좋아요 또는 좋아요 취소 완료', data);
    },
    onError: (error:AxiosError, postId: number, context:any) => {
      if (context?.prevInfiniteData) {
        showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Liked failed'})
        queryClient.setQueryData(['fetchPosts', 'Reply',context.bno], context.preReplyData);
      }
    },
  });

  const  openLikedUser = (bno:number|undefined)=>{
    if(bno){
      openModal({ type:'likedUser', props: { isModalLayer:true,isForce:true,value:{bno:bno,username:userInfo?.nickName},modal:{width:'w-104',isCenterMessage:'좋아요 정보',navButtonOption:{isClose:true}}} });
    }else{
      showFlashMessage({typeOfFlashMessage:'error',title:'error',subTitle:'can not get board id when openLikedUser'})
    }
 
    // openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
  }


  function isNumber(value: unknown): value is number {
    return typeof value === 'number';
}
 const Idnumber = `${postInfo?.typeOfPost === 'board' ? `${postInfo?.typeOfPost}:${postInfo.bno}` : `${postInfo?.typeOfPost}:${postInfo?.rno}`}`

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>,type:string) => {
    event.preventDefault(); // 기본 동작 방지
    event.stopPropagation(); // 이벤트 버블링 방지
    if(postInfo){
      if(type === 'like'){
        try{
        if(postInfo.typeOfPost === 'board' && isNumber(postInfo.bno)){
            if(postInfo.isLike){
                boardUnLikeMutation.mutate(postInfo!.bno);
            }else{
                boardLikeMutation.mutate(postInfo!.bno);
            }    
        }else if(postInfo.typeOfPost === 'reply' && isNumber(postInfo.rno) 
        ||  postInfo.typeOfPost === 'nestRe' && isNumber(postInfo.rno)
        ){ // reply
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
        openModal({ type:'createPost', props: { isPotal:false,isForce:false,value:{postInfo:postInfo,mode:'reply',profileImage:userInfo?.profilePicture,username:userInfo?.nickName},modal:{width:'w-8/12',height:'auto'}} });
      }
      else if(type === 'postMenu' && triggerId){
        console.log(triggerId)
        if(triggerId){
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
                      { type: 'linkCopy', value: '링크 복사'},
  
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
            const height = rect.height
            openModal({ type:'postMenu', props: { isTransParentBackground:true,  potalSpot:{ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },value:{boardInfo:postInfo,format:exampleFormat,locationValue:`${postInfo.typeOfPost==='nestRe'?'480px':'560px'}`}} });
          }else{
            return 
          }
        }
      
        
    }else{
      return
    }
  };

 
  const openDetailPost = ()=>{
    openModal({ type:'detailPost', props: {isForce:true,value:{postInfo},modal:{width:'w-11/12',height:'h-5/6',navButtonOption:{isClose:true}}} });
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

 

return (
  postInfo?
  <>
  {
  postInfo.typeOfPost ==='board'?
  <>
    <div key={`${postInfo.bno}${postInfo.typeOfPost}`} onClick={handleToDetailPage} className={`relative w-full flex`}>
        <div className='flex flex-col px-4 items-center py-3 w-full'>


          <div className='flex w-full'>
            <div className='pt-1'>
            <ProfileContainer isClickable={true} profileImg={postInfo.profilePicture} nickName={postInfo.nickName}></ProfileContainer>
            </div>
         

        {isConnected?
                <div className='absolute top-8 flex justify-center h-full w-10'>
                <div className={`rounded-xl h-3/6 w-[2px] my-auto ${Reverse_Bg_color_Type(isDark)}`}></div>
              </div>
        :null}

        <div className=' mx-3 w-full'>
            <div className='flex w-full relative item-center justify-between'>
                <div className='flex flex-col justify-center '>
                {isClickable === true ?
                <UserAccount isDark={isDark} username={postInfo.nickName} idNum={`${postInfo.typeOfPost === 'board' ? `${postInfo.typeOfPost}:${postInfo.bno}` : `${postInfo.typeOfPost}:${postInfo.rno}`}`}></UserAccount>
                :<div className={Font_color_Type_1(isDark)}>{postInfo.nickName}</div>
                }

                {isDetailPost?null:<p className={`${Font_color_Type_1(isDark)} text-sm`}>{postInfo.contents}</p>}       
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
                  handleOnClick(e, 'postMenu');
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
      <div className={`flex w-full mr-3" border-b ${Border_color_Type(isDark)}`}>
        {tools.map((tool, index) => (
          <div key={index} className="relative">
            <HoverBackground px="pr-3" py="py-1">
              <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={tool} />
            </HoverBackground>
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
     <div className='flex px-4 py-2 w-full'>
     <div className='pt-1'>
            <ProfileContainer profileImg={postInfo.profilePicture} nickName={postInfo.nickName}></ProfileContainer>
            </div>

            {isConnected?
                <div className={`absolute top-8 flex justify-center h-full w-10`}>
                <div className={`rounded-xl h-3/6 w-[2px] my-auto ${Reverse_Bg_color_Type(isDark)}`}></div>
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

              {isClickable === true ?
                <UserAccount isDark={isDark} username={postInfo.nickName} idNum={`${postInfo.typeOfPost === 'reply' ? `${postInfo.typeOfPost}:${postInfo.rno}` : `${postInfo.typeOfPost}:${postInfo.bno}`}`}></UserAccount>
                :<div className={` ${Font_color_Type_1(isDark)} font-bold text-base hover:underline`}>{postInfo.nickName}</div>
                }

                <p className={`text-sm ${Font_color_Type_1(isDark)}`}>{postInfo.contents}</p>
                </div>
                {isConnected ? null : 
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
                         handleOnClick(e, 'postMenu');
                       }}
                     >
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
        <div className='flex h-auto w-full mr-3 '>
         {tools.map((tool, index) => (
                <div key={index} className={`relative`}>
                  <HoverBackground px='pr-3' py='py-1'>
                    <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={tool} />
                  </HoverBackground>
                </div>
              ))}
          </div>
          {postInfo.typeOfPost === 'reply' && postInfo.numberOfComments > 0 && postInfo.bno && postInfo.rno && (
            <div className="mt-2">
              <CommentPageNation
                 numberOfComment={postInfo.numberOfComments} 
                 parentId={postInfo.bno}
                 childId={postInfo.rno}
                 initialPage={0}
                 typeOfFilter={'NestRe'}
              />
            </div>
          )}
          </>
        }

        </div>
        </div>
    </div>  
} 
    </>
  :
  null
);
}



export default PostItem;