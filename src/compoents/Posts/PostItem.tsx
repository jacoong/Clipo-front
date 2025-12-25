import React, {ReactNode,useState,useEffect,useRef,useMemo} from 'react';
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
import { MenuListItem } from '../MenuList';
import { Border_color_Type,Font_color_Type_1,Reverse_Bg_color_Type } from '../../store/ColorAdjustion';
import { COLOR } from '../../store/ThemeColor';
import PostItemSkeleton from '../skeleton/PostItemSkeleton';
import CommentPageNation from '../../pages/pageModule/pageKit/CommentPageNation';
import useMediaQuery from '../../customHook/useMediaQuery';
import { BsBookmarkFill } from 'react-icons/bs';
interface typeOfPostItem {
  postInfo?:userPost,
  isDark:boolean,
  isConnected?:boolean,
  isDetailPost?:boolean,
  index?:number,
  isClickable?:boolean,
  targetReplyId?: number,
  targetNestId?: number,
  nestInitialPage?: number,
}

const toRelativeTime = (iso?: string | null) => {
  if (!iso) return null;

  const normalizeIso = (value: string) => {
    const trimmed = value.trim();
    const withT = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
    const cappedFraction = withT.replace(/(\.\d{3})\d+$/, '$1');
    if (/Z$|[+-]\d{2}:?\d{2}$/.test(cappedFraction)) {
      return cappedFraction;
    }
    return `${cappedFraction}Z`;
  };

  let target = new Date(iso);
  if (Number.isNaN(target.getTime())) {
    const normalized = normalizeIso(iso);
    target = new Date(normalized);
    if (Number.isNaN(target.getTime())) {
      console.warn('[PostItem] toRelativeTime parse failed', {
        raw: iso,
        normalized,
        type: typeof iso,
      });
      return null;
    }
  }

  const now = new Date();
  const diffMs = now.getTime() - target.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return `${diffSec || 1}초 전`;
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;
  if (diffMonth > 0) return `${diffMonth}달 전`;
  if (diffDay >= 7) return `${Math.max(1, Math.floor(diffDay / 7))}주 전`;
  return `${diffYear}년 전`;
};

const PostItem =({
  isClickable=true,
  postInfo,
  isDark,
  isConnected=false,
  isDetailPost=false,
  targetReplyId,
  targetNestId,
  nestInitialPage
}:typeOfPostItem) => {
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
const truncatedContentRef = useRef<HTMLParagraphElement | null>(null);
const isMobile = useMediaQuery('(max-width: 768px)');
const triggerId = postInfo ? `${postInfo.typeOfPost}:${postInfo.bno ?? postInfo.rno}`:'fetchIdOfPostItem'; // 고유 ID
const isTargetReply = targetReplyId != null && postInfo?.rno === targetReplyId;
const shouldAutoLoadNest = isTargetReply && targetNestId != null;
const nestedInitialPage = shouldAutoLoadNest ? nestInitialPage ?? 0 : 0;
const [isContentExpanded, setIsContentExpanded] = useState<boolean>(Boolean(isDetailPost));
const [isContentTruncated, setIsContentTruncated] = useState<boolean>(false);
const shouldShowContentToggle = !isDetailPost && isContentTruncated;
const createdAtValue = postInfo ? ((postInfo as any).regDate ?? postInfo.regData ?? null) : null;
const relativeTime = useMemo(() => {
  if (!createdAtValue || typeof createdAtValue !== 'string') {
    return '방금 전';
  }
  const computed = toRelativeTime(createdAtValue);
  if (computed) {
    return computed;
  }
  if (createdAtValue.trim().length > 0) {
    return createdAtValue;
  }
  return '방금 전';
}, [createdAtValue]);

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

  // Like 조건 - isLikeVisible이 false면 좋아요 아이콘 숨김
  ...(postInfo?.isLikeVisible === false
    ? [] // 좋아요 아이콘 완전히 숨김
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
      queryClient.invalidateQueries(['fetchPosts', 'LikedUser', postId])
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
      queryClient.invalidateQueries(['fetchPosts', 'LikedUser', postId])

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
        if (postInfo?.bno) {
          queryClient.invalidateQueries(['fetchPosts', 'LikedUser', postInfo.bno])
        }
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
      if (postInfo?.bno) {
        queryClient.invalidateQueries(['fetchPosts', 'LikedUser', postInfo.bno])
      }
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
        openModal({ type:'createPost', props: { isConfirmClosed:true,isModalLayer:true,isPotal:false,isForce:false,value:{postInfo:postInfo,mode:'reply',profileImage:userInfo?.profilePicture,username:userInfo?.nickName},modal:{isCenterMessage:'스레드 답장',width:'w-116',height:'h-auto'}} });
      }
      else if(type === 'postMenu' && triggerId){
        console.log(triggerId)
        if(triggerId){
          // if (!triggerRef.current) return;
          // const rect = triggerRef.current.getBoundingClientRect();
          const username = userInfo?.nickName;
          const isOwned = username === postInfo.nickName;
          const typeOfPostInfo = postInfo.typeOfPost;
          // const exampleFormat = [
          //   ...(isOwned
          //     ? [
          //         { type: 'edit', value: '편집하기' },
          //         ...(postInfo.typeOfPost === 'board'
          //           ? [
          //             { type: 'linkCopy', value: '링크 복사'},
  
          //             postInfo.isLikeVisible
          //                 ? { type: 'disableShowNumberOfLike', value: '좋아요 수 숨기기' }
          //                 : { type: 'ableShowNumberOfLike', value: '좋아요 수 보이기' },
          
          //                 postInfo.isReplyAllowed
          //                 ? { type: 'disableComment', value: '댓글 비허용' }
          //                 : { type: 'ableComment', value: '댓글 허용' },
          //             ]
          //           : []
          //         ),
          
          //         { type: 'delete', value: '삭제하기' },
          //       ]
          //     : [
          //       // isOwner가 false일 때
          //       // typeOfPost가 board인 경우만 '링크 복사' 노출하고, 아닌 경우는 아무것도 추가 X
          //       ...(postInfo.typeOfPost === 'board'
          //         ? [{ type: 'linkCopy', value: '링크 복사' }]
          //         : []
          //       ),
          //       postInfo.isFollowing
          //         ? { type: 'unfollow', value: '언 팔로우하기' }
          //         : { type: 'follow', value: '팔로우하기' },
          //     ]
          //   )
          // ];

          const isBookmarked = Boolean(
            postInfo?.isBookmarked ??
            postInfo?.isBookmark ??
            postInfo?.isBookMarked,
          );
          const bookmarkMenuOption: MenuListItem = isBookmarked
            ? { type: 'unBookmark', value: '북마크 해제' }
            : { type: 'Bookmark', value: '북마크 저장' };
          const ownerMenu: MenuListItem[] = [];
          const visitorMenu: MenuListItem[] = [];
          if (isOwned) {
            ownerMenu.push({ type: 'edit', value: '편집하기' });
            if (postInfo.typeOfPost === 'board') {
              ownerMenu.push(
                { type: 'linkCopy', value: '링크 복사' },
                bookmarkMenuOption,
                postInfo.isLikeVisible
                  ? { type: 'disableShowNumberOfLike', value: '좋아요 수 숨기기' }
                  : { type: 'ableShowNumberOfLike', value: '좋아요 수 보이기' },
                postInfo.isReplyAllowed
                  ? { type: 'disableComment', value: '댓글 비허용' }
                  : { type: 'ableComment', value: '댓글 허용' },
              );
            }
            ownerMenu.push({ type: 'delete', value: '삭제하기' });
          } else {
            if (postInfo.typeOfPost === 'board') {
              visitorMenu.push(
                { type: 'linkCopy', value: '링크 복사' },
                bookmarkMenuOption,
              );
            }
            visitorMenu.push(
              postInfo.isFollowing
                ? { type: 'unfollow', value: '언 팔로우하기' }
                : { type: 'follow', value: '팔로우하기' },
            );
          }
          const exampleFormat = isOwned ? ownerMenu : visitorMenu;


          const ref = triggerDivRefs.current[triggerId];
          if (!ref) return;
            const rect = ref.getBoundingClientRect();
            const height = rect.height
            if(isMobile){
              openModal({ type:'postMenu', props: { isTransParentBackground:true, potalSpot:'center', value:{boardInfo:postInfo,format:exampleFormat,isMobile:true} } });
            }else{
              openModal({ type:'postMenu', props: { isTransParentBackground:true,  potalSpot:{ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },value:{boardInfo:postInfo,format:exampleFormat,locationValue:`${postInfo.typeOfPost==='nestRe'?'480px':'560px'}`,isMobile:false}} });
            }

           
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

  type SegmentType = 'text' | 'hashtag' | 'mention';
  interface ContentSegment {
    type: SegmentType;
    value: string;
  }

  const splitTrailingSymbols = (token: string): [string, string] => {
    const trimmed = token.trim();
    if (!trimmed) {
      return ['', ''];
    }

    const startsWithMarker = trimmed[0] === '#' || trimmed[0] === '@';
    const bodyWithSuffix = startsWithMarker ? trimmed.slice(1) : trimmed;
    const match = bodyWithSuffix.match(/^([\w가-힣]+)(.*)$/);

    if (match) {
      return [match[1], match[2] ?? ''];
    }

    return [bodyWithSuffix, ''];
  };

  const contentSegments = useMemo<ContentSegment[]>(() => {
    if (!postInfo?.contents) {
      return [];
    }

    const segments: ContentSegment[] = [];
    const text = postInfo.contents;
    // 지원하는 마크업: @[display](id), #[display](id)
    const markupPattern = /([@#])\[([^\]]+?)\]\(([^)]+?)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = markupPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          value: text.slice(lastIndex, match.index),
        });
      }

      const trigger = match[1];
      const display = match[2];

      if (trigger === '#') {
        segments.push({ type: 'hashtag', value: `#${display}` });
      } else if (trigger === '@') {
        segments.push({ type: 'mention', value: `@${display}` });
      }

      lastIndex = markupPattern.lastIndex;
    }

    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        value: text.slice(lastIndex),
      });
    }

    return segments;
  }, [postInfo?.contents]);

  useEffect(() => {
    if (isDetailPost) {
      setIsContentExpanded(true);
      setIsContentTruncated(false);
      return;
    }
    setIsContentExpanded(false);
  }, [isDetailPost, postInfo?.contents]);

  useEffect(() => {
    if (isDetailPost) {
      return;
    }
    const element = truncatedContentRef.current;
    if (!element) {
      setIsContentTruncated(false);
      return;
    }
    const isOverflowing = element.scrollHeight > element.clientHeight + 1;
    setIsContentTruncated(isOverflowing);
    if (!isOverflowing) {
      setIsContentExpanded(true);
    }
  }, [contentSegments, isDetailPost, postInfo?.contents]);

  const handleToggleContentExpand = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsContentExpanded((prev) => !prev);
  };

  const renderContentToggleButton = () => {
    if (!shouldShowContentToggle) {
      return null;
    }
    return (
      <button
        type='button'
        className={`self-start mt-1 text-xs font-semibold text-left ${isDark ? 'text-themeColor' : 'text-sky-600'}`}
        onClick={handleToggleContentExpand}
      >
        {isContentExpanded ? '접기' : '더보기'}
      </button>
    );
  };

  const renderRichContent = (
    className: string,
    options?: {
      clampLines?: number;
      isExpanded?: boolean;
      ref?: React.RefObject<HTMLParagraphElement>;
    },
  ) => {
    if (!postInfo) {
      return null;
    }

    const paragraphProps = {
      className,
      ref: options?.ref,
      style:
        !options?.isExpanded && options?.clampLines
          ? ({
              display: '-webkit-box',
              WebkitLineClamp: options.clampLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties)
          : undefined,
    };

    if (contentSegments.length === 0) {
      return <p {...paragraphProps}>{postInfo.contents}</p>;
    }

    return (
      <p {...paragraphProps}>
        {contentSegments.map((segment, index) => {
          if (segment.type === 'hashtag') {
            const [tagValue, suffix] = splitTrailingSymbols(segment.value);
            if (!tagValue) {
              return <span key={`segment-${index}`}>{segment.value}</span>;
            }
            return (
              <React.Fragment key={`segment-${index}`}>
                <Link
                  to={`/main/search/tags/post/%23${encodeURIComponent(tagValue)}`}
                  className='text-themeColor hover:underline'
                  onClick={(event) => event.stopPropagation()}
                >
                  #{tagValue}
                </Link>
                {suffix && <span>{suffix}</span>}
              </React.Fragment>
            );
          }

          if (segment.type === 'mention') {
            const [mentionValue, suffix] = splitTrailingSymbols(segment.value);
            if (!mentionValue) {
              return <span key={`segment-${index}`}>{segment.value}</span>;
            }
            return (
              <React.Fragment key={`segment-${index}`}>
                <Link
                  to={`/main/@/${encodeURIComponent(mentionValue)}`}
                  className='text-sky-500 hover:underline'
                  onClick={(event) => event.stopPropagation()}
                >
                  @{mentionValue}
                </Link>
                {suffix && <span>{suffix}</span>}
              </React.Fragment>
            );
          }

          return <span key={`segment-${index}`}>{segment.value}</span>;
        })}
      </p>
    );
  };

  const isBookmarked = useMemo(
    () =>
      Boolean(
        postInfo?.isBookmarked ??
        postInfo?.isBookmark ??
        postInfo?.isBookMarked,
      ),
    [postInfo?.isBookMarked, postInfo?.isBookmark, postInfo?.isBookmarked],
  );


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
                <div className='flex items-center gap-2'>
                  {isClickable === true ? (
                    <UserAccount
                      isDark={isDark}
                      username={postInfo.nickName}
                      idNum={
                        postInfo.typeOfPost === 'board'
                          ? `${postInfo.typeOfPost}:${postInfo.bno}`
                          : `${postInfo.typeOfPost}:${postInfo.rno}`
                      }
                    />
                  ) : (
                    <div className={Font_color_Type_1(isDark)}>{postInfo.nickName}</div>
                  )}
                  <span
                    className='text-xs whitespace-nowrap'
                    style={{ color: COLOR.customGray }}
                  >
                    {relativeTime}
                  </span>
                </div>

                {isDetailPost
                  ? null
                  : (
                    <>
                      {renderRichContent(
                        `${Font_color_Type_1(isDark)} text-sm whitespace-pre-wrap break-words`,
                        {
                          clampLines: 7,
                          isExpanded: isContentExpanded,
                          ref: truncatedContentRef,
                        },
                      )}
                      {renderContentToggleButton()}
                    </>
                  )}       
                </div>

                {isConnected?
                null
                :
                <div className='flex items-start gap-2'>
                  {isBookmarked ? (
                    <BsBookmarkFill className='text-themeColor text-lg' aria-label='bookmarked' />
                  ) : null}
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
                  <div className='sibal'>
   <HoverBackground>
                        <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={{type:'postMenu',value:null}}></PostTool>
                    </HoverBackground>
                  </div>
                
                </div>
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
        {renderRichContent(
          `text-sm whitespace-pre-wrap break-words ${Font_color_Type_1(
            isDark,
          )}`,
        )}
      </div>

      {/* Tools Section */}
      <div className={` flex w-full mr-3 border-b ${Border_color_Type(isDark)}`}>
        {tools.map((tool, index) => (
          <div key={index} className="relative">
            <HoverBackground px="pr-3" py="py-1">
              <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={tool} />
            </HoverBackground>
          </div>
        ))}
      </div>

      {/* Reply and Like Section */}
      <div className='flex justify-between items-center pt-4 h-12'>
        <div><p>답글</p></div>
        {
          postInfo.isLikeVisible ? 
          <div 
            className={`inline-block cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 ${isDark ? 'hover:bg-hovercustomBlack' : 'hover:bg-hoverLightGray'}`}
            onClick={()=>{openLikedUser(postInfo.bno)}}
          >
            좋아요 보기
          </div>
          : 
          <div 
            className={`inline-block  px-3 py-2 rounded-lg`}
          >
            좋아요 비활성
          </div>
        }

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
                <div className='h-auto'>
                {/* <Link 
                onMouseEnter={()=>{showUserAccount('open')}}
                onClick={(e) => {
                e.stopPropagation(); 
    }}className={`font-bold text-base`} to={`/main/@/${postInfo.nickName}`}>{postInfo.nickName}</Link> */}

              <div className='flex items-center gap-2'>
                {isClickable === true ? (
                  <UserAccount
                    isDark={isDark}
                    username={postInfo.nickName}
                    idNum={
                      postInfo.typeOfPost === 'reply'
                        ? `${postInfo.typeOfPost}:${postInfo.rno}`
                        : `${postInfo.typeOfPost}:${postInfo.bno}`
                    }
                  />
                ) : (
                  <div className={` ${Font_color_Type_1(isDark)} font-bold text-base hover:underline`}>
                    {postInfo.nickName}
                  </div>
                )}
                <span
                  className='text-xs whitespace-nowrap'
                  style={{ color: COLOR.customGray }}
                >
                  {relativeTime}
                </span>
              </div>

                <>
                  {renderRichContent(
                    `text-sm ${Font_color_Type_1(isDark)} whitespace-pre-wrap break-words`,
                    {
                      clampLines: 7,
                      isExpanded: isContentExpanded,
                      ref: truncatedContentRef,
                    },
                  )}
                  {renderContentToggleButton()}
                </>
                </div>
                {isConnected ? null : 
                       <div className='flex items-center gap-2'>
                        {isBookmarked ? (
                          <BsBookmarkFill className='text-themeColor text-lg' aria-label='bookmarked' />
                        ) : null}
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
                          handleOnClick(e, 'sspostMenu');
                        }}
                      >
                    <HoverBackground px='px-2' py='py-2'>
                        <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={{type:'postMenu',value:null}}></PostTool>
                    </HoverBackground>
                </div>
                </div>}
            </div>
 

        <div className='my-1  leading-5 whitespace-pre-wrap'>
            <div className='my-1'>
            <div className='h-auto'>
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
                isDark={isDark}
                 numberOfComment={postInfo.numberOfComments} 
                 parentId={postInfo.bno}
                 childId={postInfo.rno}
                 nestInitialPage={nestedInitialPage}
                 typeOfFilter={'NestRe'}
                 targetNestId={shouldAutoLoadNest ? targetNestId : undefined}
                 autoLoadNest={shouldAutoLoadNest}
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
