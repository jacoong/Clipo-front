import useModal from '../../../customHook/useModal';
import { useSelector } from 'react-redux';
import {useEffect,useState,useRef} from 'react';
import { modalSelector } from '../../../store/modalSlice'
import ProfileContainer from '../../ProfileContainer';
import Button from '../../Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

const CreatePost = ({value,isDark}:any)=>{
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {profileImage,username} = value;
    const [initialVal, setInitialval] = useState<string|undefined>(undefined);
  const modalState = useSelector(modalSelector);
  

//   const tools = [
//     {type:'upLoadPicture',value:{numberValue:postInfo.numberOfLike,isLike:postInfo.isLike}},
//     {type:'reply',value:{numberValue:postInfo.numberOfLike}},
//     {type:'edit',value:null},
//     {type:'delete',value:null},
// ];

  // props를 콘솔에 출력 (선택사항)
  console.log("Modal Props:", profileImage,username,isDark);

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };


  const handleInput = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target;
    const value = target.value;
  
    // Update the state
    setInitialval(value);
  
    // Adjust the height of the textarea
    target.style.height = 'auto'; // Reset height to calculate scrollHeight accurately
    target.style.height = `${target.scrollHeight}px`; // Set height based on content
  };
return(
<form  className={`w-full flex no-underline border-b ${isDark?'border-customLightGray':'border-customGray'}`}>
<div className='flex px-3 py-2 w-full'>
    <ProfileContainer profileImg={profileImage} nickName={username}></ProfileContainer>
   <div className='w-full ml-3'>
       <div className='flex align-middle h-5'>
           <p className={`font-bold text-base no-underline ${isDark? 'text-customWhite':'text-customBlack'}`}>{username}</p>
       </div>

   <div className='leading-5 h-auto whitespace-pre-wrap'>
    <textarea  ref={textAreaRef} className={`overflow-hidden h-auto resize-none focus:outline-none bg-transparent ${isDark?'text-customWhite':'border-customBlack'}`} placeholder='포스트를 입력하세요' onChange={(value: React.ChangeEvent<HTMLTextAreaElement>)=>{handleInput(value)}} value={initialVal}></textarea>
       <div className='my-3'>
   </div>
   </div>
   {/* <div className='flex text-customGray w-full mr-3'>
       {
           tools.map(tool=>(
               <HoverBackground px='px-3' py='py-1'>
                   <PostTool handleOnClick={handleOnClick}isDark={isDark} typeOfTool={tool}></PostTool>
               </HoverBackground>
           ))
       }
     </div> */}
     <Button width='50px' padding='5px 10px'>게시</Button>
   </div>
   </div>
</form> 
)
}

export default CreatePost;