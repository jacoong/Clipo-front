import useModal from '../../../customHook/useModal';
import { useSelector } from 'react-redux';
import {useEffect,useState,useRef} from 'react';
import { modalSelector } from '../../../store/modalSlice'
import ProfileContainer from '../../ProfileContainer';
import Button from '../../Button';
import ContentSlider from '../../Posts/ContentSlider';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import HoverBackground from '../../HoverBackground';
import Services from '../../../store/ApiService'
import PostTool from '../../Posts/PostTool';
import PostItem from '../../Posts/PostItem';
import BoardItem from '../../Posts/BoardItem';
import { userPost } from '../../../store/types';
import { useFlashMessage } from '../../../customHook/useFlashMessage';
import {useQueryClient} from 'react-query';
import { RootState } from '../../../store';

interface imageType  {
  previewImage:any;
  imageFile:File | undefined |string;
}

interface CreatePostType  {
    isDark:boolean;
    value:typeOfValue
  }

interface typeOfValue {
  // profilePicture:any;
  // username:any;
  parentInfo?:any;
  postInfo?:userPost
  mode:'create'|'edit'|'reply'|'nestRe'
}
  
const CreatePost = ({value,isDark}:CreatePostType)=>{
    const userInfo = useSelector((state:RootState) => state.loginUserInfo);
    const textBoxRef = useRef<HTMLDivElement>(null);
    const {mode,postInfo} = value;
    const [initialVal, setInitialval] = useState<string>('');
    const modalState = useSelector(modalSelector);
    const {closeModal} = useModal();
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
    const [isComposing, setIsComposing] = useState(false);
    const queryClient = useQueryClient();
    const tools = [
      { type: 'morePicture', value: { isAdded: false } },
      ...(mode === 'create' || mode === 'edit' && postInfo?.typeOfPost === 'board'
        ? 
        [
          { type: 'tags', value: { isTaged: false } },
            { type: 'likeVisible', value: { isLikeVisible: likeVisible } },
            { type: 'replyAllowed', value: { isReplyAllowed: replyAllowed } }
          ]
        : [
          ]
        )
    ];

    function areArraysEqualUnorderedWithCount(a: string[], b: string[]): boolean {
      console.log(a,b)
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
    setLikeVisible(postInfo.isLikeVisible)
    setReplyAllowed(postInfo.isReplyAllowed)
    setHashTags(postInfo.tags)

    if (textBoxRef.current) {
      const contentsValue =  postInfo.contents;
      textBoxRef.current.innerText = contentsValue;
      handleInput();
    }
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
          contents: initialVal,
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
        contents: initialVal,
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
        queryClient.invalidateQueries(['fetchPosts', 'Reply',postInfo?.bno]);
        queryClient.invalidateQueries(['fetchPosts', 'NestRe',postInfo?.rno]);
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
          await queryClient.invalidateQueries(['fetchPosts','MainRandom']);
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
        if(postInfo?.typeOfPost === 'reply'){
          queryClient.invalidateQueries(['fetchPosts','Reply',postInfo?.bno]);
        }else{
          queryClient.invalidateQueries(['fetchPosts','NestRe',postInfo?.parentRno]);
        }
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
        const contentValue = textBoxRef.current?.innerText; // 현재 div 내 텍스트
        if(contentValue){
            formData.append('content', contentValue)
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
            createReplyOrNestRe.mutate(formData);
        }else{
            formData.append('isLikeVisible', String(likeVisible));
            formData.append('isReplyAllowed', String(replyAllowed));
            if(hashTags.length>0){
                formData.append('tags', hashTags.join(','));
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
        const contentValue = textBoxRef.current?.innerText; // 현재 div 내 텍스트
        if(contentValue && contentValue !== postInfo.contents){
          formData.append('content',contentValue) 
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

          // if(!areArraysEqualUnorderedWithCount(hashTags,postInfo.tag)){
          if(!areArraysEqualUnorderedWithCount(hashTags,postInfo.tags)){
              formData.append('tags', hashTags.join(','));
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
      }
    }
      
    
    

  // props를 콘솔에 출력 (선택사항)


  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };



//   const handleHashTagManagement = (hashTagsValue: string[]) => {

//     const hashTagValue = hashTagsValue[0]; // 이거로 필터링 할예정
//     setHashTags((prev) => Array.from(new Set([...prev, ...hashTagsValue])));
 

//     console.log("Detected Hashtags:", hashTagsValue);
//   };

  useEffect(()=>{
    console.log(hashTags,'hasgtags')
    console.log(mentions,'mentions')
  },[hashTags,mentions])  



  // useEffect(()=>{
  //   if(postInfo){
  //     if(postInfo.typeOfPost !== 'board'){
  //       fetchedBoard.mutate(String(postInfo.bno));
  //     }
  //   }
  // },[postInfo])
 

  const handleCompositionStart = () => {
    setIsComposing(true);
  };
  
  const handleCompositionEnd = () => {
    setIsComposing(false);
    handleInput(); // 조합이 끝나고 나면 처리
  };


  const handleImageChanged = (event:React.ChangeEvent<HTMLInputElement>) => {
    console.log('changed!')
    const typeOfPost = postInfo?.typeOfPost;

    if(event.target.files){
      const imgFiles = event.target.files;
      console.log(imgFiles,'imgFiles');
      Array.from(imgFiles).forEach((image) => {
        if(mode ==='create' || mode === 'edit' && typeOfPost ==='board'){
          setImageArray((prev)=>[
            ...prev,
            {previewImage:URL.createObjectURL(image),imageFile:image} ]);
        }else{
          setImageArray(
            [{previewImage:URL.createObjectURL(image),imageFile:image}]);
        }
        })
    }
  };

  const defineIdValueOfImage = (imageArray:imageType[])=>{
    return imageArray.map((imgSrc:imageType)=>(imgSrc.previewImage))
  }

  const defineOriginalImage = (imageArray: imageType[]) => {
    return imageArray
      .filter((imgSrc) => !imgSrc.previewImage.startsWith('blob:'))
      .map((imgSrc) => imgSrc.previewImage);
  };

  const handleOnClick = (event: React.MouseEvent<HTMLDivElement>,type:string) => {
    event.preventDefault(); // 기본 동작 방지
    event.stopPropagation(); // 이벤트 버블링 방지
    if(type === 'morePicture'){
        if (fileInputRef.current) {
            fileInputRef.current.click(); // 버튼 클릭 이벤트 트리거
          }
        }
    else if(type === 'replyAllowed'){
        setReplyAllowed(!replyAllowed)
    }
    else if(type === 'tags'){
        
    }
    else if(type === 'likeVisible'){
        setLikeVisible(!likeVisible)
    }
    else if(type === 'replyAllowed'){
        setReplyAllowed(!replyAllowed)
    }
    // try{
    //     if(type === 'morePicture'){
    //     if (fileInputRef.current) {
    //         fileInputRef.current.click(); // 버튼 클릭 이벤트 트리거
    //       }
    //     }
    // catch(error:any){
    //     console.error("An error occurred:", error.message);
    // }
    return
  }


  const handleInput = () => {

    if (!textBoxRef.current) return;
    const text = textBoxRef.current.innerText; // 현재 div 내 텍스트
    if (text.length <= 0) return;
    const newHTML = highlightHashtags(text);
    if (textBoxRef.current.innerHTML !== newHTML) {
        textBoxRef.current.innerHTML = newHTML;
    
      // 커서를 텍스트 끝으로 이동 (간단한 방식)
      const range = document.createRange();
      range.selectNodeContents(textBoxRef.current);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isComposing) return;
  
    // 사용자가 '#'이나 '@'를 입력했을 때 바로 하이라이트 시도
    if (e.key === '#' || e.key === '@' || e.key === ' ' || e.key === 'Enter') {
      handleInput(); // 조합이 끝났고, 태그가 입력된 상황 → 바로 하이라이트
    
  };
}

const highlightHashtags = (text: string): string => {
    const combinedRegex = /(#[^\s#@]+)|(@[^\s#@]+(?: [^\s#@]+)*)/g;
    
    // matchAll로 모든 매칭 결과를 배열로 확보
    const matches = [...text.matchAll(combinedRegex)];
    let highlighted = '';
    let lastIndex = 0;
  
    const newHashTags: string[] = [];
    const newMentions: string[] = [];

    for (const match of matches) {
    const token = match[0];
    const index = match.index || 0;

    highlighted += text.slice(lastIndex, index);

    if (token.startsWith('#')) {
      highlighted += `<span style="color:blue;font-weight:bold">${token}</span>`;
      newHashTags.push(token);
    } else {
      highlighted += `<span style="color:green;font-weight:bold">${token}</span>`;
      newMentions.push(token);
    }

    lastIndex = index + token.length;
  }

  highlighted += text.slice(lastIndex);

  // ✅ React 상태 업데이트
  setHashTags(newHashTags);
  setMentions(newMentions);

  return highlighted;
  };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
//     const hashtagRegex = /#[^\s#@]+(?=$|\s)/g;
//     const mentionRegex = /@[^\s#@]+(?=$|\s)/g;
//     if (!textBoxRef.current) return;
//     const text = textBoxRef.current.innerText; // 현재 div 내 텍스트
//     const hashMatches = text.match(hashtagRegex)||[];
//     const mentionsMatches = text.match(mentionRegex)||[];
//     if (e.key === ' ' || e.key === 'Enter') {
//         if(hashMatches.length >0){
//             setHashTags(prev => Array.from(new Set([...prev, ...hashMatches])));
//         }
//         if (mentionsMatches.length > 0) {
//             setMentions((prev) => Array.from(new Set([...prev, ...mentionsMatches])));
//           }
//   };
// }

function removeImage(indexToRemove: number,imageSrc:string) {
  setImageArray((prevArray) => 
    prevArray.filter((_, i) => i !== indexToRemove)
  );
}

const parentInfo = ()=>{

  if(postInfo){
    const typeOfPost = postInfo.typeOfPost;
      console.log(typeOfPost,mode)
  if(typeOfPost === 'board'){
    if(mode === 'edit'){
      return 
    }else{
      return  <PostItem isConnected={true} postInfo={postInfo} isDark={isDark}></PostItem>
    }
  }
  if(typeOfPost === 'reply'){
      if(mode ==='edit'){
        return  <PostItem isConnected={true} postInfo={boardInfo} isDark={isDark}></PostItem>
      }else if(mode === 'reply'){
        return  <><PostItem isConnected={true} postInfo={boardInfo} isDark={isDark}></PostItem>
        <PostItem isConnected={true} postInfo={postInfo} isDark={isDark}></PostItem>
        </>
      }
    }

  else if(typeOfPost === 'nestRe'){
    if(mode ==='edit'){
      return <>
         <PostItem isConnected={true} postInfo={boardInfo} isDark={isDark}></PostItem>
         <PostItem isConnected={true} postInfo={replyInfo} isDark={isDark}></PostItem>
      </>
    }
  }
}
}

return(
    <div className='h-auto max-h-124 overflow-auto'>
        <div>
        {parentInfo()}
        </div>

    <form onSubmit={mode ==='edit'?submitEditPost:submitCreatePost}>
    <div onClick={handleModalClick} className='flex px-3 py-2'>
    <ProfileContainer profileImg={postInfo!.profilePicture} nickName={postInfo!.nickName}></ProfileContainer>
   <div className='overflow-hidden mx-3'>
       <div className='flex align-middle h-5'>
           <p className={`font-bold text-base`}>{postInfo!.nickName}</p>
       </div>
   <div className='leading-5 h-auto whitespace-pre-wrap'>
    {/* <textarea  ref={textAreaRef} className={`overflow-hidden h-auto resize-none focus:outline-none bg-transparent ${isDark?'text-customWhite':'border-customBlack'}`} placeholder='포스트를 입력하세요' onChange={(value: React.ChangeEvent<HTMLTextAreaElement>)=>{handleTextChange(value)}} value={initialVal}></textarea> */}
    <div
      ref={textBoxRef}
      role="textbox"
      aria-multiline="true"
      onKeyDown={handleKeyDown}
      // onKeyDown={handleKeyDown}
      className="w-72 h-auto py-2 overflow-auto whitespace-pre-wrap focus:outline-none"
      contentEditable="true"
      tabIndex={0} 
      aria-label="Editable text field with hashtag highlighting"
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => {
        setIsComposing(false);
        handleInput()
      }}
    >
    </div>

       <div className='my-3'>
   </div>
   </div>
   <div className='my-3'>
            <div className='max-h-430px w-full'>
                <ContentSlider sendDeleteList={removeImage} isEditable={true} contentsValue={defineIdValueOfImage(imageArray)} isDark={isDark}/>
            </div>
        </div>
        {postInfo?
          <input className='hidden' ref={fileInputRef} id='backgroundFile' multiple={mode === 'create' || mode === 'edit' && postInfo.typeOfPost ==='board'}  type="file" name="myFile" onChange={handleImageChanged}/>
        :  <input className='hidden' ref={fileInputRef} id='backgroundFile' multiple={true}  type="file" name="myFile" onChange={handleImageChanged}/>
        }
      
   <div className='flex mb-2 text-customGray w-full'>
       {
           tools.map(tool=>(
               <HoverBackground px='px-3' py='py-1'>
                   <PostTool handleOnClick={handleOnClick} isDark={isDark} typeOfTool={tool}></PostTool>
               </HoverBackground>
           ))
       }
     </div>
     <Button width='50px' padding='5px 10px'>게시</Button>
   </div>
   </div>
    </form> 
    </div>
)
}

export default CreatePost;