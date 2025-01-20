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

interface imageType  {
  previewImage:any;
  imageFile:File | undefined
}

interface CreatePostType  {
    isDark:boolean;
    value:typeOfValue
  }

interface typeOfValue {
  profileImage:any;
  username:any;
  parentInfo?:any;
  isReplyAllowed?:boolean;
  isLikeVisible?:boolean;
  
}
  
const EditPost = ({value,isDark}:CreatePostType)=>{
 
    const textBoxRef = useRef<HTMLDivElement>(null);
    const {profileImage,username,parentInfo,isReplyAllowed,isLikeVisible} = value;
    const [initialVal, setInitialval] = useState<string>('');
    const modalState = useSelector(modalSelector);
    const {closeModal} = useModal();
    const { AuthService, UserService ,SocialService} = Services;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {flashMessage,showFlashMessage} = useFlashMessage();
    const [imageArray, setImageArray] = useState<imageType[]>([]);
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [mentions, setMentions] = useState<string[]>([]);
    const [likeVisible, setLikeVisible] = useState<boolean>(true);
    const [replyAllowed, setReplyAllowed] = useState<boolean>(true);
    const [boardInfo,setBoardInfo] = useState<userPost|undefined>(undefined);
    const queryClient = useQueryClient();
  const tools = [
    {type:'morePicture',value:{isAdded:false}},
    {type:'tag',value:{isTaged:false}},
    {type:'likeVisible',value:{isLikeVisible:likeVisible}},
    {type:'replyAllowed',value:{isReplyAllowed:replyAllowed}},
];

useEffect(()=>{
    console.log(value,'edit')
},[])

// function optimisticPostUpdate(oldData: any, formData: FormData,typeOfPost:string) {
//   if (!oldData) return oldData;

//   const optimisticPost = createOptimisticPost(typeOfPost);
//   console.log(optimisticPost,'important')
//   return {
//     ...oldData,
//     pages: oldData.pages.map((page: any) => {
//       return {
//         ...page,
//         body: [optimisticPost,...page.body]
//       };
//     }),
//   };
// }

const modificatePost = useMutation<void, AxiosError<{ message: string }>,FormData>(SocialService.modificateBoard, {
  onMutate:async (formData:FormData) => {
    closeModal();
    showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'Processing edit...'})
    const prevInfiniteData = await queryClient.getQueryData(['fetchPosts', 'MainRandom']);
    console.log('arrow',prevInfiniteData)
  },
    onSuccess: async() => {
      showFlashMessage({typeOfFlashMessage:'success',title:'Success',subTitle:'success created edit...'})
      await queryClient.invalidateQueries(['fetchPosts','MainRandom']);
      await queryClient.invalidateQueries(['fetchDetailBoardInfo',parentInfo.bno]); // board
    },
    onError: (error:AxiosError) => {
        alert(error.response?.data || '포스트 생성 실패');
    }
    });

const modificateReplyOrNestRe = useMutation<void, AxiosError<{ message: string }>,FormData>(SocialService.modificateComment, {
  onMutate: (formData:FormData) => {
    closeModal();
    showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'Processing edit...'})
  },  
  onSuccess: async() => {
        console.log('포스트 생성 성공');
        closeModal();
        await queryClient.invalidateQueries(['fetchPosts','reply',parentInfo.rno]);
    },
    onError: (error:AxiosError) => {
        alert(error.response?.data || '포스트 생성 실패');
    }
    });

const fetchedBoard = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.fetchedBoard, {
        onSuccess: (data) => {
          console.log('fetched board 완료', data);
          setBoardInfo(data.data.body)
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          alert('fetched board 오류발생')
        }
      });

const submitEdit =async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const formData = new FormData();


        if(initialVal){
            formData.append('content', initialVal)
        }
      
        if(parentInfo && (parentInfo.typeOfPost === 'board' && parentInfo.typeOfPost === 'reply')){
            formData.append('bno',parentInfo.bno);
            if(parentInfo.parentRno){ // 현재 대댓글인지 아닌지 
                formData.append('parentRno',String(parentInfo.parentRno));
            }
            if(parentInfo.imageArray){
                formData.append('commentImage',String(imageArray[0]));
            }
            modificatePost.mutate(formData);
        }else{
            formData.append('isLikeVisible', String(likeVisible));
            formData.append('isReplyAllowed', String(replyAllowed));
            if(hashTags.length>0){
                formData.append('tag', hashTags.join(','));
            }
            Array.from(imageArray).forEach((image) => {
                if(image.imageFile){
                    formData.append('boardImages', image.imageFile); // 동일한 키로 여러 파일 추가
                }
            });
            modificateReplyOrNestRe.mutate(formData);
        }
    }



const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
};


  useEffect(()=>{
    console.log(hashTags,'hasgtags')
    console.log(mentions,'mentions')
  },[hashTags,mentions])



  useEffect(()=>{
    if(parentInfo){
      if(parentInfo.typeOfPost === 'reply'){
        fetchedBoard.mutate(String(parentInfo.bno));
    }else{
      return
    }
    }
  },[parentInfo])


const handleImageChanged = (event:React.ChangeEvent<HTMLInputElement>) => {
  if(event.target.files){
    const imgFiles = event.target.files;
    console.log(imgFiles,'imgFiles');
    Array.from(imgFiles).forEach((image) => {
      setImageArray((prev)=>[
              ...prev,
              {previewImage:URL.createObjectURL(image),imageFile:image} ]);
      })
  }
};
const defineIdValueOfImage = (imageArray:imageType[])=>{
  console.log(imageArray.map((imgSrc:imageType)=>(imgSrc.previewImage)))
  return imageArray.map((imgSrc:imageType)=>(imgSrc.previewImage))
}
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
  else if(type === 'tag'){
      
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
const handleInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if (!textBoxRef.current) return;
  const text = textBoxRef.current.innerText; // 현재 div 내 텍스트
  setInitialval(text);
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
const highlightHashtags = (text: string): string => {
    const combinedRegex = /(#[^\s#@]+)|(@[^\s#@]+(?: [^\s#@]+)*)/g;
    
    // matchAll로 모든 매칭 결과를 배열로 확보
    const matches = [...text.matchAll(combinedRegex)];
    let highlighted = '';
    let lastIndex = 0;
  
    for (const match of matches) {
      const token = match[0];
      const index = match.index || 0;
  
      // 매치 시작 전까지의 일반 텍스트 추가
      highlighted += text.slice(lastIndex, index);
  
      // 토큰에 따라 색상 적용
      if (token.startsWith('#')) {
        highlighted += `<span style="color:blue;font-weight:bold">${token}</span>`;
      } else {
        highlighted += `<span style="color:green;font-weight:bold">${token}</span>`;
      }
  
      lastIndex = index + token.length;
    }
  
    // 마지막 매치 뒤 남은 텍스트 추가
    highlighted += text.slice(lastIndex);
  
    return highlighted;
};
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const hashtagRegex = /#[^\s#@]+(?=$|\s)/g;
    const mentionRegex = /@[^\s#@]+(?=$|\s)/g;
    if (!textBoxRef.current) return;
    const text = textBoxRef.current.innerText; // 현재 div 내 텍스트
    const hashMatches = text.match(hashtagRegex)||[];
    const mentionsMatches = text.match(mentionRegex)||[];
    if (e.key === ' ' || e.key === 'Enter') {
        if(hashMatches.length >0){
            setHashTags(prev => Array.from(new Set([...prev, ...hashMatches])));
        }
        if (mentionsMatches.length > 0) {
            setMentions((prev) => Array.from(new Set([...prev, ...mentionsMatches])));
          }
  };
}


return(
    <div className='h-auto max-h-124 overflow-auto'>
        <div>
            {
        parentInfo?
        parentInfo.typeOfPost ==='board'? 
        <>
        <PostItem isConnected={true} postInfo={parentInfo} isDark={isDark}></PostItem>
        </>
        :
        parentInfo.typeOfPost ==='reply' && boardInfo? 
        <>
            {/* <BoardItem bno={parentInfo.bno} isDark={isDark}></BoardItem> */}
            <PostItem isConnected={true} postInfo={boardInfo} isDark={isDark}></PostItem>
            <PostItem isConnected={true} postInfo={parentInfo} isDark={isDark}></PostItem>
        </>
        : null
        :
        null
        }
        </div>

    <form onSubmit={submitEdit}>
    <div onClick={handleModalClick} className='flex px-3 py-2'>
    <ProfileContainer profileImg={profileImage} nickName={username}></ProfileContainer>
   <div className='overflow-hidden mx-3'>
       <div className='flex align-middle h-5'>
           <p className={`font-bold text-base`}>{username}</p>
       </div>
   <div className='leading-5 h-auto whitespace-pre-wrap'>
    {/* <textarea  ref={textAreaRef} className={`overflow-hidden h-auto resize-none focus:outline-none bg-transparent ${isDark?'text-customWhite':'border-customBlack'}`} placeholder='포스트를 입력하세요' onChange={(value: React.ChangeEvent<HTMLTextAreaElement>)=>{handleTextChange(value)}} value={initialVal}></textarea> */}
    <div
      ref={textBoxRef}
      role="textbox"
      aria-multiline="true"
      onKeyDown={handleKeyDown}
      className="w-72 h-auto p-2 overflow-auto whitespace-pre-wrap focus:outline-none"
      contentEditable="true"
      onInput={handleInput}
      tabIndex={0} 
      aria-label="Editable text field with hashtag highlighting"
    >
    </div>

       <div className='my-3'>
   </div>
   </div>
   <div className='my-3'>
            <div className='max-h-430px w-full'>
                <ContentSlider contentsValue={defineIdValueOfImage(imageArray)} isDark={isDark}/>
            </div>
        </div>
        {parentInfo?
          <input className='hidden' ref={fileInputRef} id='backgroundFile' multiple={parentInfo.typeOfPost === 'board'}  type="file" name="myFile" onChange={handleImageChanged}/>
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
     <Button width='50px' padding='5px 10px'>편집</Button>
   </div>
   </div>
    </form> 
    </div>
)
}

export default EditPost;