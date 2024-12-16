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

interface imageType  {
    previewImage:any;
    imageFile:File | undefined
  }
  
const CreatePost = ({value,isDark}:any)=>{
    const hashtagRegex = /#[^\n#@]+/g;
    const mentionRegex = /@[^\s#@]+/g; // @ 뒤에 공백, #, @이 아닌 문자열

    const textBoxRef = useRef<HTMLDivElement>(null);
    const {profileImage,username} = value;
    const [initialVal, setInitialval] = useState<string>('');
    const modalState = useSelector(modalSelector);
    const {closeModal} = useModal();
    const { AuthService, UserService ,SocialService} = Services;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageArray, setImageArray] = useState<imageType[]>([]);
    const [hashTags, setHashTags] = useState<string[]>([]);
    const [mentions, setMentions] = useState<string[]>([]);
    const [likeVisible, setLikeVisible] = useState<boolean>(true);
    const [replyAllowed, setReplyAllowed] = useState<boolean>(true);

  const tools = [
    {type:'morePicture',value:{isAdded:false}},
    {type:'tag',value:{isTaged:false}},
    {type:'likeVisible',value:{isLikeVisible:likeVisible}},
    {type:'replyAllowed',value:{isReplyAllowed:replyAllowed}},
];

const createPost = useMutation<void, AxiosError<{ message: string }>,FormData>(SocialService.createBoasrd, {
    onSuccess: () => {
        console.log('포스트 생성 성공');
        closeModal();
    },
    onError: (error:AxiosError) => {
        alert(error.response?.data || '포스트 생성 실패');
    }
    });


    const submitCreatePost =async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const formData = new FormData();

        Array.from(imageArray).forEach((image) => {
            if(image.imageFile){
                formData.append('boardImages', image.imageFile); // 동일한 키로 여러 파일 추가
            }
        });

        if(initialVal){
            formData.append('content', initialVal)
        }
        if(hashTags.length>0){
            formData.append('tag', hashTags.join(','));
        }
        formData.append('isLikeVisible', 'true');
        formData.append('isReplyAllowed', 'true');

        createPost.mutate(formData);
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

//   const highlightHashtags = (text:string): string => {
//     const hashtagRegex = /#[^\s#@]+(?=$|\s)/g;
//     const mentionRegex = /@[^\s#@]+(?=$|\s)/g;

//     let highlighted = '';
//     let lastIndex = 0;

//     text.replace(hashtagRegex, (match, index) => {
//       highlighted += `<span>${text.slice(lastIndex, index)}</span>`; // 일반 텍스트
//       highlighted += `<span id=(hightLightHashId${index}) style="color:blue;font-weight:bold">${match}</span>`; // 해시태그
//       lastIndex = index + match.length;
//       return match;
//     });

//     text.replace(mentionRegex, (match, index) => {
//         highlighted += `<span>${text.slice(lastIndex, index)}</span>`; // 일반 텍스트
//         highlighted += `<span id=(hightLightHashId${index}) style="color:green;font-weight:bold">${match}</span>`; // 해시태그
//         lastIndex = index + match.length;
//         return match;
//       });

//     highlighted += `<span>${text.slice(lastIndex)}</span>`; // 마지막 남은 텍스트

//     return highlighted;
//   };

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
<form onSubmit={submitCreatePost} className={`no-underline border-b ${isDark?'border-customLightGray':'border-customGray'}`}>
<div onClick={handleModalClick} className='flex px-3 py-2'>
    <ProfileContainer profileImg={profileImage} nickName={username}></ProfileContainer>
   <div className='overflow-hidden mx-3'>
       <div className='flex align-middle h-5'>
           <p className={`font-bold text-base no-underline ${isDark? 'text-customWhite':'text-customBlack'}`}>{username}</p>
       </div>
   <div className='leading-5 h-auto whitespace-pre-wrap'>
    {/* <textarea  ref={textAreaRef} className={`overflow-hidden h-auto resize-none focus:outline-none bg-transparent ${isDark?'text-customWhite':'border-customBlack'}`} placeholder='포스트를 입력하세요' onChange={(value: React.ChangeEvent<HTMLTextAreaElement>)=>{handleTextChange(value)}} value={initialVal}></textarea> */}
    <div
      ref={textBoxRef}
      role="textbox"
      aria-multiline="true"
      onKeyDown={handleKeyDown}
      className="w-72 h-32 border border-gray-300 p-2 overflow-auto whitespace-pre-wrap focus:outline-none"
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
        <input className='hidden' ref={fileInputRef} id='backgroundFile' multiple  type="file" name="myFile" onChange={handleImageChanged}/>
   <div className='flex text-customGray w-full mr-3'>
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
)
}

export default CreatePost;