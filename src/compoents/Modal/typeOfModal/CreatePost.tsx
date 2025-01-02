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


interface imageType  {
  previewImage:any;
  imageFile:File | undefined |string;
}

interface CreatePostType  {
    isDark:boolean;
    value:typeOfValue
    mode:'create'|'edit'
  }

interface typeOfValue {
  profileImage:any;
  username:any;
  parentInfo?:any;
  postInfo?:userPost
}
  
const CreatePost = ({value,isDark,mode='create'}:CreatePostType)=>{
 
    const textBoxRef = useRef<HTMLDivElement>(null);
    const {profileImage,username,postInfo} = value;
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
    const [boardInfo,setBoardInfo] = useState<userPost|undefined>(undefined);
    const [replyInfo,setReplynfo] = useState<userPost|undefined>(undefined);

    const tools = [
      { type: 'morePicture', value: { isAdded: false } },
      ...(postInfo?.typeOfPost === 'board'
        ? [
          { type: 'tag', value: { isTaged: false } },
            { type: 'likeVisible', value: { isLikeVisible: likeVisible } },
            { type: 'replyAllowed', value: { isReplyAllowed: replyAllowed } }
          ]
        : [])
    ];


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

const createPost = useMutation<void, AxiosError<{ message: string }>,FormData>(SocialService.createBoasrd, {
    onSuccess: () => {
        console.log('포스트 생성 성공');
        closeModal();
    },
    onError: (error:AxiosError) => {
        alert(error.response?.data || '포스트 생성 실패');
    }
    });

const createReplyOrNestRe = useMutation<void, AxiosError<{ message: string }>,FormData>(SocialService.createReplyOrNestRe, {
    onSuccess: () => {
        console.log('포스트 생성 성공');
        closeModal();
    },
    onError: (error:AxiosError) => {
        alert(error.response?.data || '포스트 생성 실패');
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
        onSuccess: () => {
            console.log('포스트 변경 성공');
            // closeModal();
        },
        onError: (error:AxiosError) => {
            alert(error.response?.data || '포스트 변경 실패');
        }
        });
    
    const modificateReplyOrNestRe = useMutation<void, AxiosError<{ message: string }>,FormData>(SocialService.modificateComment, {
        onSuccess: () => {
            console.log('댓글 변경 성공');
            // closeModal();
        },
        onError: (error:AxiosError) => {
            alert(error.response?.data || '댓글 변경 실패');
        }
        });

    const submitCreatePost =async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const formData = new FormData();


        if(initialVal){
            formData.append('content', initialVal)
        }
      
        if(postInfo && (postInfo.typeOfPost === 'nestRe' || postInfo.typeOfPost === 'reply')){
            formData.append('bno',String(postInfo.bno));
            if(postInfo.parentRno){ // 현재 대댓글인지 아닌지 
                formData.append('parentRno',String(postInfo.parentRno));
                if(postInfo.commentImage){
                  formData.append('commentImage',postInfo.commentImage[0]);
              }
            }
       
            createPost.mutate(formData);
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
            createReplyOrNestRe.mutate(formData);
        }
    }

    const submitEditPost =async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();

      const formData = new FormData();
      if(postInfo){
        if(initialVal !== postInfo.contents){
          formData.append('content',initialVal)
        }

        if (postInfo.typeOfPost === 'board') {
          const originalImages = postInfo.boardImages!;
            const changed = areImagesChanged(originalImages, imageArray);
 
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
          console.log(hashTags,postInfo.tags)
          if(hashTags !== postInfo.tags){
              formData.append('tag', hashTags.join(','));
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



  useEffect(()=>{
    if(postInfo){
      if(postInfo.typeOfPost === 'reply'){
        console.log(postInfo,'꼬치집')
        fetchedBoard.mutate(String(postInfo.bno));
      }else if(postInfo.typeOfPost === 'nestRe'){
        fetchedBoard.mutate(String(postInfo.bno));
      return
    }
    }
  },[postInfo])


  const handleImageChanged = (event:React.ChangeEvent<HTMLInputElement>) => {
    console.log('changed!')
    if(event.target.files){
      const imgFiles = event.target.files;
      console.log(imgFiles,'imgFiles');
      Array.from(imgFiles).forEach((image) => {
        if(postInfo?.typeOfPost ==='board'){
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


  const handleInput = () => {
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

function removeImage(indexToRemove: number,imageSrc:string) {
  setImageArray((prevArray) => 
    prevArray.filter((_, i) => i !== indexToRemove)
  );
}

const parentInfo = ()=>{
  switch(postInfo?.typeOfPost){
    case'board':
      return mode ==='create'?
      (<PostItem isConnected={true} postInfo={postInfo} isDark={isDark}></PostItem>)
      :null
    case'reply':
      return mode ==='create'? 
      (<>
      <PostItem isConnected={true} postInfo={boardInfo} isDark={isDark}></PostItem>
      <PostItem isConnected={true} postInfo={postInfo} isDark={isDark}></PostItem>
      </>):<PostItem isConnected={true} postInfo={boardInfo} isDark={isDark}></PostItem>
    case'nestRe':
        return mode ==='edit'?
        (<>
              <PostItem isConnected={true} postInfo={boardInfo} isDark={isDark}></PostItem>
              <PostItem isConnected={true} postInfo={replyInfo} isDark={isDark}></PostItem>
        </>):null
  }
}

return(
    <div className='h-auto max-h-124 overflow-auto'>
        <div>
        {parentInfo()}
        </div>

    <form onSubmit={mode ==='create'?submitCreatePost:submitEditPost}>
    <div onClick={handleModalClick} className='flex px-3 py-2'>
    <ProfileContainer profileImg={profileImage} nickName={`${mode === 'create'?username:postInfo?.nickName}`}></ProfileContainer>
   <div className='overflow-hidden mx-3'>
       <div className='flex align-middle h-5'>
           <p className={`font-bold text-base`}>{`${mode === 'create'?username:postInfo?.nickName}`}</p>
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
                <ContentSlider sendDeleteList={removeImage} isEditable={true} contentsValue={defineIdValueOfImage(imageArray)} isDark={isDark}/>
            </div>
        </div>
        {postInfo?
          <input className='hidden' ref={fileInputRef} id='backgroundFile' multiple={postInfo.typeOfPost === 'board'}  type="file" name="myFile" onChange={handleImageChanged}/>
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