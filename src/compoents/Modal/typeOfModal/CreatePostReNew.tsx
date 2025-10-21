import useModal from '../../../customHook/useModal';
import { useSelector } from 'react-redux';
import {useEffect,useState,useRef,useMemo,useCallback} from 'react';
import { modalSelector } from '../../../store/modalSlice'
import ProfileContainer from '../../ProfileContainer';
import Button from '../../Button';
import ContentSlider from '../../Posts/ContentSlider';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import HoverBackground from '../../HoverEventCompoents/HoverBackground';
import Services from '../../../store/ApiService';
import PostTool from '../../Posts/PostTool';
import PostItem from '../../Posts/PostItem';
import { userPost, ModalOptions } from '../../../store/types';
import { useFlashMessage } from '../../../customHook/useFlashMessage';
import {useQueryClient} from 'react-query';
import { RootState } from '../../../store';
import { MentionsInput, Mention, OnChangeHandlerFunc } from 'react-mentions'
import Suggestion from '../Suggestion';
import mentionStyles from './react-metion.module.css';
import { Font_color_Type_1,Bg_color_Type_2, Border_color_Type } from '../../../store/ColorAdjustion';

interface imageType  {
  previewImage:any;
  imageFile:File | undefined |string;
}

interface CreatePostType  {
    isDark:boolean;
    value:typeOfValue;
    isFullScreen?: boolean;
    modal?: ModalOptions;
  }

interface typeOfValue {
  // profilePicture:any;
  // username:any;
  parentInfo?:any;
  postInfo?:userPost
  mode:'create'|'edit'|'reply'|'nestRe'
}



  
const CreatePostReNew = ({value,isDark,isFullScreen = false, modal}:CreatePostType)=>{
    const [textAreaValue, setTextAreaValue] = useState<string>('');
   
    const userInfo = useSelector((state:RootState) => state.loginUserInfo);
    const {mode,postInfo} = value;

    const modalState = useSelector(modalSelector);
    const {closeModal,closeAllModal} = useModal();
    const {flashMessage,showFlashMessage} = useFlashMessage();
    const { AuthService, UserService ,SocialService} = Services;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageArray, setImageArray] = useState<imageType[]>([]);
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [mentions, setMentions] = useState<string[]>([]);
    const [likeVisible, setLikeVisible] = useState<boolean>(true);
    const [replyAllowed, setReplyAllowed] = useState<boolean>(true);
    const [boardInfo,setBoardInfo] = useState<userPost|undefined>(undefined);
    const [replyInfo,setReplynfo] = useState<userPost|undefined>(undefined);
    const [portalHost, setPortalHost] = useState<Element | undefined>(undefined);

    useEffect(() => {
      // 모든 modal-root 요소를 찾아서 가장 최상위 것 사용
      const modalRoots = document.querySelectorAll('#modal-root');
      const topmostModalRoot = modalRoots[modalRoots.length - 1]; // 마지막 요소가 가장 최상위
      
      if (topmostModalRoot) {
        setPortalHost(topmostModalRoot);
      } else {
        // modal-root가 없으면 body 사용
        setPortalHost(document.body);
      }
    }, []);



    const queryClient = useQueryClient();
    const tools = useMemo(() => {
      const baseTools = [{ type: 'morePicture', value: { isAdded: false } }];
      const shouldShowBoardTools =
        mode === 'create' || (mode === 'edit' && postInfo?.typeOfPost === 'board');

      if (!shouldShowBoardTools) {
        return baseTools;
      }

      return [
        ...baseTools,
        { type: 'tags', value: { isTaged: false } },
        { type: 'likeVisible', value: { isLikeVisible: likeVisible } },
        { type: 'replyAllowed', value: { isReplyAllowed: replyAllowed } },
      ];
    }, [mode, postInfo?.typeOfPost, likeVisible, replyAllowed]);

    const previewSegments = useMemo(() => {
      if (!textAreaValue) {
        return [] as Array<{ type: 'text' | 'hashtag' | 'mention'; value: string }>;
      }

      const regex = /(@[\p{L}\p{N}_]+|#[\p{L}\p{N}_]+)/gu;
      const segments: { type: 'text' | 'hashtag' | 'mention'; value: string }[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(textAreaValue)) !== null) {
        if (match.index > lastIndex) {
          segments.push({
            type: 'text',
            value: textAreaValue.slice(lastIndex, match.index),
          });
        }

        if (match[0].startsWith('@')) {
          segments.push({ type: 'mention', value: match[0] });
        } else if (match[0].startsWith('#')) {
          segments.push({ type: 'hashtag', value: match[0] });
        }

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < textAreaValue.length) {
        segments.push({
          type: 'text',
          value: textAreaValue.slice(lastIndex),
        });
      }

      return segments;
    }, [textAreaValue]);

    const s = Services.SocialService;



    function areArraysEqualUnorderedWithCount(a: string[], b: string[]): boolean {
      console.log(a,b)
      // null/undefined 체크 추가
      if (!a || !b) return false;
      if (a.length !== b.length) return false;
    
      const countMap = (arr: string[]) =>
        arr.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
    
      const aCount = countMap(a);
      const bCount = countMap(b);
    
      return Object.keys(aCount).every(key => aCount[key] === bCount[key]);
    }
    

    function areImagesChanged(originalImages: string[], imageArray: imageType[]): boolean {
      // 1) 현재 state 기준으로 string 배열을 만들어 비교
      const currentImages = imageArray.map((imgObj) => {
          return imgObj.previewImage;
      });
    

        if (currentImages.length !== originalImages.length) {
          console.log('이미지 개수가 달라졌습니다 → 변경됨');
          return true;
        }
      
        // 3) 길이가 같을 때, 각 요소 비교
        const isAllSame = currentImages.every((value, index) => {
          return value === originalImages[index]; // 반드시 return
        });
        if (!isAllSame) {
          console.log('파일명(주소)가 달라졌습니다 → 변경됨');
          return true;
        }
      
      // 2) 길이(개수) 비교
      // 4) 여기까지 왔다면, 길이도 같고 모든 요소 값이 동일
      console.log('변경 없음(Dirty 아님)');
      return false;
    }

useEffect(()=>{
  console.log(value,'value')
  if(mode==='edit' && postInfo){
    setTextAreaValue(postInfo.contents)
    setLikeVisible(postInfo.isLikeVisible)
    setReplyAllowed(postInfo.isReplyAllowed)
    setHashTags(postInfo.tags)
    setMentions(postInfo.mentions)


    const contentsValue =  postInfo.contents;
    setTextAreaValue(contentsValue);

    if(postInfo.typeOfPost ==='board' && postInfo.boardImages){
      const newArray = Object.entries(postInfo.boardImages).map(([key, value]) => {
        return {
          previewImage: value,
          imageFile:undefined
        };
      });
      setImageArray(newArray)
    }else if(postInfo.commentImage){
      const commentImage = postInfo.commentImage;
      setImageArray([{previewImage:commentImage,imageFile:undefined}])
    }
  }
},[])


function createOptimisticPost(typeOfPost:string) {


  const nowISO = new Date().toISOString();
  const optimisticId = -Math.floor(Math.random() * 1000000);

  if (userInfo) {
    const isNestRe = (typeOfPost === 'nestRe');
    console.log(isNestRe,typeOfPost,'nestRe') 
    if(typeOfPost === 'board'){
        const newBoard = {
          typeOfPost: 'board',
          bno: optimisticId,
          contents: textAreaValue,
          boardImages: imageArray.length > 0 ? imageArray.map((image)=>{return image.previewImage}) : undefined,
          nickName: userInfo.nickName,
          profilePicture: userInfo.profilePicture,
          numberOfLike: 0,
          numberOfComments: 0,
          tags: hashTags.length>0?[hashTags.join(',')]:[],
          regData: nowISO,
          isLike: false,
          isFollowing: false,
          isLikeVisible: likeVisible ?? true,
          isReplyAllowed: replyAllowed ?? true,
        };
        return newBoard;
    }else{
      const newReply = {
        typeOfPost: isNestRe ? 'nestRe' : 'reply',
        parentRno: isNestRe ? postInfo?.rno : undefined, 
        bno: postInfo?.bno,  
        rno: optimisticId, 
        contents: textAreaValue,
        commentImage: imageArray.length > 0
          ? imageArray[0].previewImage
          : undefined,
        nickName: userInfo.nickName,
        profilePicture: userInfo.profilePicture,
        numberOfLike: 0,
        numberOfComments: 0,
        regData: nowISO,
        isLike: false,
        isFollowing: false, 
      };

      return newReply;
    }
  }
 
}


function optimisticPostUpdate(oldData: any, formData: FormData,typeOfPost:string) {
  if (!oldData) return oldData;

  const optimisticPost = createOptimisticPost(typeOfPost);
  console.log(optimisticPost,'important')
  return {
    ...oldData,
    pages: oldData.pages.map((page: any) => {
      return {
        ...page,
        body: {
          ...page.body, // hasNext, hasPrev, page 유지
          data: [optimisticPost, ...page.body.data], // ✅ data만 갱신
        }
      };
    }),
  };
}


const createPost = useMutation<void, AxiosError<{ message: string }>,FormData>(SocialService.createBoard, {
    onMutate:async (formData:FormData) => {
      await queryClient.cancelQueries(['fetchPosts', 'MainRandom']);
      showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'Processing Create Post...'})
      const prevInfiniteData = queryClient.getQueryData(['fetchPosts', 'MainRandom']);
      queryClient.setQueryData(['fetchPosts', 'MainRandom'], (oldData: any) =>
        optimisticPostUpdate(oldData, formData,'board')
      );
      closeModal();

      return { prevInfiniteData };
    },
    onSuccess: async() => {
        console.log('포스트 생성 성공');
        await queryClient.invalidateQueries(['fetchPosts','MainRandom']);
        showFlashMessage({typeOfFlashMessage:'success',title:'Sucess',subTitle:'Sucessful Create Post'})
    },
    onError: async(error:AxiosError) => {
      console.log(error.response?.data)
      await queryClient.invalidateQueries(['fetchPosts','MainRandom']);
      showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Create Post failed',})
    }
    });

const createReplyOrNestRe = useMutation<void, AxiosError<{ message: string }>,FormData>(SocialService.createReplyOrNestRe, {
  onMutate:async (formData:FormData) => {
    const bno = postInfo?.bno;
    const parentRno = postInfo?.rno;
    await queryClient.cancelQueries(['fetchPosts', 'MainRandom']);
    await queryClient.cancelQueries(['fetchPosts', 'Reply',bno]);
    showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'Processing Create Reply...'})

    const preMainRandom = queryClient.getQueryData(['fetchPosts', 'MainRandom']); // mainpage
    const preDetailBoardData = queryClient.getQueryData(['fetchDetailBoardInfo',bno]); // board
    const preReplyData = queryClient.getQueryData(['fetchPosts', 'Reply',bno]); // reply
    const preNestReData = queryClient.getQueryData(['fetchPosts', 'NestRe',parentRno]); // nest

    if(preMainRandom){
      queryClient.setQueryData(['fetchPosts', 'MainRandom'], (oldPost: any) => {
        if (!oldPost) return oldPost;
      
        return {
          ...oldPost,
          pages: oldPost.pages.map((page: any) => ({
            ...page,
            body: {
              ...page.body, // hasNext, hasPrevious, page 유지
              data: page.body.data.map((post: any) => {
                if (post.bno === bno) {
                  return {
                    ...post,
                    numberOfComments: post.numberOfComments + 1, // ✅ 댓글 수 증가
                  };
                }
                return post;
              }),
            },
          })),
        };
      });
    } 
    if(preDetailBoardData){ //상세페이지인지 확인

      if(postInfo?.typeOfPost === 'reply'){ // 현재 댓글등록하는 상태 즉 reply에다가 nestRe 등록하려니까 이게맞음
        queryClient.setQueryData(['fetchPosts', 'Reply',bno], (oldData: any) =>{ //
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
              return {
                ...page,
                body: {
                  ...page.body,
                  data: page.body.data.map((post: any) => {
                    if (post.bno === bno) {
                      // 좋아요 상태와 좋아요 수만 변경
                      return {
                        ...post,
                        numberOfComments: post.numberOfComments + 1,
                      };
                    }
                    return post;
                  })
                }
              };
            }),
          };
        }
          );
      }else{
        queryClient.setQueryData(['fetchPosts', 'Reply',bno], (oldData: any) => //type 이 reply 일떄만 넣어줘야함
        optimisticPostUpdate(oldData, formData,'reply')
      );
      }
  
      queryClient.setQueryData(['fetchDetailBoardInfo', bno], (oldData: any) =>{ // board 의 댓글 숫자 + 1
        console.log(oldData);
        if (!oldData) return oldData;
        return {
          ...oldData,
          data:{
            ...oldData.data,
            body: {
              ...oldData.data.body,
              numberOfComments: oldData.data.body.numberOfComments + 1,
            },
          }
        };
      }
        );

    }
    if(preNestReData){ // nestReData 가 펼쳐졌을떄 대댓글 추가시 mutate
      console.log(preNestReData)
      queryClient.setQueryData(['fetchPosts', 'NestRe',parentRno], (oldData: any) =>
        optimisticPostUpdate(oldData, formData,'nestRe')
      );
    }
    closeModal();

    return { preReplyData,preMainRandom,preNestReData,bno,parentRno };
  },  
  onSuccess: async() => {
        closeModal();
        // queryClient.invalidateQueries(['fetchPosts', 'Reply',postInfo?.bno]);
        // queryClient.invalidateQueries(['fetchPosts', 'NestRe',postInfo?.rno]);
        queryClient.invalidateQueries(['fetchPosts']);
        showFlashMessage({typeOfFlashMessage:'success',title:'success',subTitle:'Create Reply failed'})
    },
    onError: (error:AxiosError,formData,context:any) => {
      if (context?.preMainRandom) {
        queryClient.setQueryData(['fetchPosts', 'MainRandom'], context.preReplyData);
      }
      else if (context?.preMainRandom) {
        queryClient.setQueryData(['fetchDetailBoardInfo', context.bno], context.preMainRandom);
      }
      else if (context?.preMainRandom) {
        queryClient.setQueryData(['fetchPosts', 'NestRe',context.parentRno], context.preNestReData);
      }
        showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Create Reply failed'})
    }
    });

    const fetchedBoard = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.fetchedBoard, {
        onSuccess: (data) => {
          console.log('fetched board 완료', data);
          setBoardInfo(data.data.body)
          if(postInfo && postInfo.typeOfPost === 'nestRe'){
            if(postInfo.parentRno){
              fetchedNestReDetail.mutate(postInfo.parentRno)
            }
          }
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          alert('fetched board 오류발생')
        }
      });

      const fetchedNestReDetail = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.fetchedReplyDetail, {
        onSuccess: (data) => {
            console.log('fetched nestRE 성공',data);
            setReplynfo(data.data.body);
            // closeModal();
        },
        onError: (error:AxiosError) => {
            alert(error.response?.data || 'fetched nestRE 실패');
        }
        });

      const modificatePost = useMutation<void, AxiosError<{ message: string }>,FormData>(SocialService.modificateBoard, {
        onMutate:async (formData:FormData) => {
          closeModal();
          showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'Processing edit...'})
          const prevInfiniteData = await queryClient.getQueryData(['fetchPosts', 'MainRandom']);
          const preDetailboardInfo = await queryClient.getQueryData(['fetchDetailBoardInfo', postInfo?.bno]);
          return { preDetailboardInfo, prevInfiniteData };
        },
        onSuccess: async() => {
          showFlashMessage({typeOfFlashMessage:'success',title:'Success',subTitle:'success created edit...'})
          await queryClient.invalidateQueries(['fetchPosts']);
          await queryClient.invalidateQueries(['fetchDetailBoardInfo',postInfo?.bno]); // board
        },
        onError: (error:AxiosError,formData,context:any) => {
          if(context?.preDetailboardInfo){
            queryClient.setQueryData(['fetchPosts', 'MainRandom'],context.preDetailboardInfo);
          }
          else if(context?.prevInfiniteData){
            queryClient.setQueryData(['fetchDetailBoardInfo',postInfo?.bno],context.prevInfiniteData);
          }
          showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Modify Post failed'})
        }
        });
    
    const modificateReplyOrNestRe = useMutation<void, AxiosError<{ message: string }>,FormData>(SocialService.modificateComment, {
      onMutate:async (formData:FormData) => {
        closeModal();
        showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'Processing edit...'})
        const queryKey = postInfo?.typeOfPost === 'reply'
        ? ['fetchPosts', 'Reply', postInfo?.bno]
        : ['fetchPosts', 'NestRe', postInfo?.parentRno];
      
      const previousData = queryClient.getQueryData(queryKey);
      console.log(previousData,'sfsfsfsfs')
      closeModal();
      return { queryKey, previousData };
      },  
      onSuccess: () => {
        showFlashMessage({typeOfFlashMessage:'success',title:'Success',subTitle:'Modify Reply Success'})
        console.log(postInfo?.typeOfPost,postInfo?.rno)
     
          queryClient.invalidateQueries(['fetchPosts']);
     
        },
        onError: (error:AxiosError,formData,context:any) => {
          if (context?.previousData) {
            queryClient.setQueryData(context.queryKey, context.previousData);
          }
            showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Modify Reply failed'})
        }
        });
        


    const submitCreatePost =async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const formData = new FormData();
        if(textAreaValue){
            formData.append('content', textAreaValue)
        }
      
        if(postInfo && (postInfo.typeOfPost === 'board' && mode==='reply' || postInfo.typeOfPost === 'reply')){
            formData.append('bno',String(postInfo.bno));
            if(postInfo.typeOfPost === 'reply'){ // 현재 대댓글인지 아닌지 wdawdsd
                formData.append('parentRno',String(postInfo.rno));
              }
                if (imageArray.length > 0) {
                  const imageFile = imageArray[0]?.imageFile; 
                  if (imageFile!==undefined) {
                    formData.append('commentImage', imageFile);
                  } else {
                    console.error('imageFile is not a valid Blob');
                  }
                }

                if(mentions.length>0){
                    formData.append('mentions', mentions.join(','));
                }
                if(hashTags.length>0){
                    formData.append('tags', hashTags.join(','));
                }

            createReplyOrNestRe.mutate(formData);
        }else{
            formData.append('isLikeVisible', String(likeVisible));
            formData.append('isReplyAllowed', String(replyAllowed));
            if(hashTags.length>0){
                formData.append('tags', hashTags.join(','));
            }
            if(mentions.length>0){
                formData.append('mentions', mentions.join(','));
            }
            Array.from(imageArray).forEach((image) => {
                if(image.imageFile){
                    formData.append('boardImages', image.imageFile); // 동일한 키로 여러 파일 추가
                }
            });
          createPost.mutate(formData);
        }
    }

    const submitEditPost =async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();

      const formData = new FormData();
      if(postInfo){
        if(textAreaValue){
          formData.append('content',textAreaValue) 
        }

        if (postInfo.typeOfPost === 'board') {
          const originalImages = postInfo.boardImages!;
            // const changed = areImagesChanged(originalImages, imageArray);
 
              Array.from(imageArray).forEach((image) => {
                if(image.imageFile){
                    formData.append('newImages', image.imageFile); // 동일한 키로 여러 파일 추가
                }
            });

            console.log(defineOriginalImage(imageArray).length)
            if(defineOriginalImage(imageArray).length>0){
              console.log(defineOriginalImage(imageArray).length)
              formData.append('originImages', defineOriginalImage(imageArray).join(','));
            }else{
              console.log(defineOriginalImage(imageArray).length)
            }

            
          if(likeVisible !== postInfo.isLikeVisible){
            formData.append('isLikeVisible',String(likeVisible))
          }
          if(replyAllowed !== postInfo.isReplyAllowed){
            formData.append('isReplyAllowed',String(replyAllowed))
          }

          formData.append('bno',String(postInfo.bno))
          modificatePost.mutate(formData)
        }else{
          const originalImages = postInfo.commentImage!;
          const changed = areImagesChanged([originalImages], imageArray);
          if(changed){
            Array.from(imageArray).forEach((image)=>{
              if(image.imageFile){
                formData.append('newImage', image.imageFile); // 동일한 키로 여러 파일 추가
              }
            })
          }
          formData.append('rno',String(postInfo.rno))
          formData.append('bno',String(postInfo.bno))
          modificateReplyOrNestRe.mutate(formData)
        }
        if(!areArraysEqualUnorderedWithCount(hashTags,postInfo.tags)){
            formData.append('tags', hashTags.join(','));
        }
        if(!areArraysEqualUnorderedWithCount(mentions,postInfo.mentions)){
            return
            formData.append('mentions', mentions.join(','));
        }
      }
    }
      

  const handleModalClick = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  }, []);

  const handleImageChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      return;
    }

    const mapped = Array.from(files).map((image) => ({
      previewImage: URL.createObjectURL(image),
      imageFile: image,
    }));

    const typeOfPost = postInfo?.typeOfPost;

    setImageArray((prev) => {
      if (mode === 'create' || (mode === 'edit' && typeOfPost === 'board')) {
        return [...prev, ...mapped];
      }
      return mapped.slice(0, 1);
    });
  }, [mode, postInfo?.typeOfPost]);

  const defineIdValueOfImage = (imageArray:imageType[])=>{
    
    return imageArray.map((imgSrc:imageType)=>(imgSrc.previewImage))
  }

  const defineOriginalImage = (imageArray: imageType[]) => {
    if (!imageArray || !Array.isArray(imageArray)) {
      return [];
    }
    return imageArray
      .filter((imgSrc) => imgSrc && imgSrc.previewImage && !imgSrc.previewImage.startsWith('blob:'))
      .map((imgSrc) => imgSrc.previewImage);
  };

  const handleOnClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, type: string) => {
      event.preventDefault();
      event.stopPropagation();

      if (type === 'morePicture') {
        fileInputRef.current?.click();
        return;
      }

      if (type === 'tags') {
        setTextAreaValue((prev) => `${prev}#`);

        setTimeout(() => {
          const mentionsTextarea = Array.from(
            document.querySelectorAll('textarea'),
          ).find((textarea) => {
            const parent = textarea.parentElement;
            return (
              parent &&
              (parent.classList.contains('mentions-input') ||
                parent.querySelector('.mentions-input') ||
                textarea.getAttribute('data-testid') === 'mentions-input')
            );
          });

          if (mentionsTextarea) {
            const textarea = mentionsTextarea as HTMLTextAreaElement;
            textarea.focus();
            const length = textarea.value.length;
            textarea.setSelectionRange(length, length);
            textarea.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          }
        }, 200);
        return;
      }

      if (type === 'likeVisible') {
        setLikeVisible((prev) => !prev);
        return;
      }

      if (type === 'replyAllowed') {
        setReplyAllowed((prev) => !prev);
        return;
      }
    },
    [],
  );
  const handleInput = useCallback<OnChangeHandlerFunc>((_, __, newPlainTextValue) => {
    setTextAreaValue(newPlainTextValue);

    const atMentions = Array.from(newPlainTextValue.matchAll(/@[\p{L}\p{N}_]+/gu)).map(m => m[0]);
    const hashMentions = Array.from(newPlainTextValue.matchAll(/#[\p{L}\p{N}_]+/gu)).map(m => m[0]);

    setMentions(atMentions);
    setHashTags(hashMentions);
  }, []);
  

    // setMentions(prev => prev.filter(m => currentMentions.includes(m)));

  
  

 


const removeImage = useCallback((indexToRemove: number, _imageSrc?: string) => {
  setImageArray((prevArray) => prevArray.filter((_, i) => i !== indexToRemove));
}, []);



const parentInfoContent = useMemo(() => {
  if (!postInfo) {
    return null;
  }

  const typeOfPost = postInfo.typeOfPost;

  if (typeOfPost === 'board') {
    if (mode === 'edit') {
      return null;
    }
    return (
      <PostItem
        isClickable={false}
        isConnected={true}
        postInfo={postInfo}
        isDark={isDark}
      />
    );
  }

  if (typeOfPost === 'reply') {
    if (mode === 'edit') {
      return (
        <PostItem isConnected={true} postInfo={boardInfo} isDark={isDark} />
      );
    }
    if (mode === 'reply') {
      return (
        <>
          <PostItem isConnected={true} postInfo={boardInfo} isDark={isDark} />
          <PostItem isConnected={true} postInfo={postInfo} isDark={isDark} />
        </>
      );
    }
  }

  if (typeOfPost === 'nestRe' && mode === 'edit') {
    return (
      <>
        <PostItem isConnected={true} postInfo={boardInfo} isDark={isDark} />
        <PostItem isConnected={true} postInfo={replyInfo} isDark={isDark} />
      </>
    );
  }

  return null;
}, [postInfo, mode, boardInfo, replyInfo, isDark]);




const hasFixedHeight = Boolean(modal?.height && modal.height.startsWith('h-'));

const baseContainerClass = `rounded-xl flex flex-col ${Bg_color_Type_2(isDark)}`;

const containerClass = isFullScreen
  ? `${baseContainerClass} w-full h-full overflow-y-auto`
  : hasFixedHeight
    ? `${baseContainerClass} h-full overflow-y-auto`
    : `${baseContainerClass} h-auto max-h-124 overflow-auto`;

const actionBarClass = isFullScreen
  ? 'flex justify-end pb-6 pt-4 mt-auto'
  : 'flex justify-end pt-3 mt-6';



const declearUUIDOFData = (type:'hashTag'|'user',values:any) => {
    if(type === 'user'){
        return values.map((value:any) => ({
            id: Math.floor(Math.random() * 1000000).toString(), // 0~999999 범위 랜덤 숫자
            display:`@${value.nickName}`,
            email:value.email,
            profilePicture:value.profilePicture
          }));
    }else{
        return values.map((value:any) => ({
            id: Math.floor(Math.random() * 1000000).toString(), // 0~999999 범위 랜덤 숫자
            display:value,
          }));
    }
  };



 

return(
    <div className={containerClass}>
        <div>
        {parentInfoContent}
        </div>

    <form className='flex flex-col min-h-0 h-full' onSubmit={mode ==='edit'?submitEditPost:submitCreatePost}>
    <div onClick={handleModalClick} className='flex h-full p-4 min-h-0'>
    <ProfileContainer isClickable={false} profileImg={userInfo!.profilePicture} nickName={userInfo!.nickName}></ProfileContainer>
   <div className='flex flex-col overflow-hidden mx-3 w-full h-full'>
       <div className='flex align-middle h-5 mb-2'>
           <p className={`${Font_color_Type_1(isDark)} font-bold text-base`}>{userInfo!.nickName}</p>
       </div>
   <div className='relative leading-5 text-base h-auto whitespace-pre-wrap'>

    {/*
      Parse textAreaValue into segments for preview rendering.
      Each segment is either plain text, hashtag, or mention.
    */}
    <div
      className={`pointer-events-none absolute inset-0 whitespace-pre-wrap break-words px-0 ${Font_color_Type_1(isDark)} text-base leading-5`}
      aria-hidden="true"
    >
      {textAreaValue.length > 0 ? (
        previewSegments.map((segment, index) => {
          if (segment.type === 'hashtag') {
            return (
              <span key={`preview-hashtag-${index}`} className='text-themeColor'>
                {segment.value}
              </span>
            );
          }
          if (segment.type === 'mention') {
            return (
              <span key={`preview-mention-${index}`} className='text-sky-500'>
                {segment.value}
              </span>
            );
          }
          return <span key={`preview-text-${index}`}>{segment.value}</span>;
        })
      ) : (
        <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          새로운 소식이 있나요?
        </span>
      )}
    </div>

    <MentionsInput
    placeholder=""
    classNames={{
      control: `${mentionStyles.mentionsControl} relative`,
      input: `${mentionStyles.mentionsInput}`,
      highlighter: `${mentionStyles.mentionsHighlighter}`,
    }}
    style={{
      control: {
        backgroundColor: 'transparent',
        lineHeight: '1.25rem',
        padding: 0,
        fontSize: '1rem',
        fontFamily: 'inherit',
      },
      suggestions: {
        zIndex: 1200,
        borderRadius: '30px',
        list: { backgroundColor: `${isDark ?'#0A0A0A' :'#FFFFFF'}`, borderRadius: 8, overflow: 'hidden' },
        item: { borderRadius: 8 }
      },
      input: {
        color: 'transparent',
        backgroundColor: 'transparent',
        caretColor: `${isDark ? '#F1F1F1' : '#212121'}`,
        lineHeight: '1.25rem',
        padding: 0,
        fontSize: '1rem',
        fontFamily: 'inherit',
      },
      highlighter: {
        color: 'transparent',
        lineHeight: '1.25rem',
        fontSize: '1rem',
        padding: 0,
        fontFamily: 'inherit',
      },
    }}
    suggestionsPortalHost={portalHost}  
    value={textAreaValue} onChange={handleInput}>
    <Mention
        trigger="@"
        data={async (search, callback) => {
            try {
              const rawData = await s.searchUserAccount(
                search,
                0
              );
              const formattedData = rawData.data.body.data;
          
              const formatted = declearUUIDOFData('user',formattedData)
              callback(formatted);
            } catch (e) {
              callback([]);
            }
          }}
    renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
        <Suggestion
          isDark={isDark}
          key={suggestion.id}
          suggestion={suggestion}
          highlightedDisplay={highlightedDisplay}
          focused={focused}
          type="user"
        />

      )}
     />
  <Mention
   className='mention-mentions__suggestions'
  trigger="#"
  data={async (search, callback) => {
    try {
      const rawData = await s.searchHashTag(`#${search}`, 0);
      const formattedData = rawData.data.body.data;
      const formatted = declearUUIDOFData('hashTag', formattedData);
      if (formatted.length === 0 && search.trim() !== "") {
        callback([
          {
            id: `new`,
            display: `#${search}`,
          },
        ]);
      } else {
        callback(formatted);
      }
    } catch (e) {
      callback([]);
    }
  }}
  renderSuggestion={(suggestion, search, highlightedDisplay, index, focused) => (
    <Suggestion
      isDark={isDark}
      key={suggestion.id}
      suggestion={suggestion}
      highlightedDisplay={highlightedDisplay}
      focused={focused}
      type="tag"
    />
  )}
/>
    </MentionsInput>

   
   </div>
   <div className=''>
            <div className='max-h-430px w-full'>
                <ContentSlider sendDeleteList={removeImage} isEditable={true} contentsValue={defineIdValueOfImage(imageArray)} isDark={isDark}/>
            </div>
        </div>
        {postInfo?
          <input className='hidden' ref={fileInputRef} id='backgroundFile' multiple={mode === 'create' || mode === 'edit' && postInfo.typeOfPost ==='board'}  type="file" name="myFile" onChange={handleImageChanged}/>
        :  <input  className='hidden' ref={fileInputRef} id='backgroundFile' multiple={true}  type="file" name="myFile" onChange={handleImageChanged}/>
        }
      
   <div className='flex w-full mt-1'>
       {
           tools.map(tool=>(
               <HoverBackground px='px-1' py='py-0'>
                   <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={tool}></PostTool>
               </HoverBackground>
           ))
       }
     </div>

       <div className={actionBarClass}>      
     <Button width='60px' padding='5px 10px'>게시</Button>
   </div>

   </div>
  
   </div>
  
    </form> 

    </div>
)
}

export default CreatePostReNew;
