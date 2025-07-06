import React, {ReactNode,useRef} from 'react';
import { FaRegComment } from "react-icons/fa";
import { AiOutlineHeart,AiFillHeart } from "react-icons/ai";
import { AiOutlinePicture } from "react-icons/ai";
import { TbSend2 } from "react-icons/tb";
import { FaHashtag } from "react-icons/fa";
import { LuEye } from "react-icons/lu";
import { LuEyeOff } from "react-icons/lu"
import { PiChatLight } from "react-icons/pi";
import { PiChatSlash } from "react-icons/pi";
import { FaEllipsis } from "react-icons/fa6";
import { IoIosArrowDropdown } from "react-icons/io";
import useModal from '../../customHook/useModal';

interface typeOfPostTool {
        typeOfTool:{
          type:string;
          value:any;
          postInfo?:any;
        };
        isDark:boolean;
        handleOnClick:(event: React.MouseEvent<HTMLDivElement>,type:string) => void;
}






const PostTool =({typeOfTool,handleOnClick,isDark}:typeOfPostTool) => {
  const copyLinkDivRef = useRef<HTMLDivElement | null>(null);
  const { openModal,closeModal } = useModal()
  
  const showShareOption = (type:'linkCopy') =>{
     if(type === 'linkCopy'){
      const ref = copyLinkDivRef.current;
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const format = [{ type: 'linkCopy', value: '링크 복사' }] 
      console.log(typeOfTool);
      openModal({ type:'postMenu', props: {isTransParentBackground:true , potalSpot:{ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },value:{boardInfo:typeOfTool.value.postInfo,format:format,locationValue:'none'}} });
      // const URL = (`${CLIENTURL}main/@/${postInfo.nickName}/post/${postInfo.bno}`)
      // handleCopyLink(URL);
    }
  }

    const renderIcon = () => {
        switch (typeOfTool.type) {
          case "reply":
            return <FaRegComment className={`${isDark?'customWhite':'customWhite'} text-lg inline-block align-middle`}/>;
          case "like":
            return typeOfTool.value?.isLike? (
              <AiFillHeart className="text-customRed text-lg inline-block align-middle" />
            ) : (
              <AiOutlineHeart className={`${isDark?'customWhite':'customWhite'} text-lg inline-block align-middle`} />
            );
          case "linkCopy":
            return <div ref={copyLinkDivRef} onClick={()=>showShareOption('linkCopy')}>
            <TbSend2 className={`${isDark?'customWhite':'customWhite'} text-lg inline-block align-middle`}/>
            </div>
          case "tags":
            return(
              <FaHashtag className={`${isDark?'customWhite':'text-customWhite'}text-lg inline-block align-middle`} />
            );
          case "morePicture":
            return typeOfTool.value?.isLike? (
              <AiOutlinePicture className={`${isDark?'customWhite':'customWhite'} text-lg inline-block align-middle`} />
            ) : (
              <AiOutlinePicture className={`${isDark?'customWhite':'customWhite'} text-lg inline-block align-middle`}>
                <p>추가</p>
              </AiOutlinePicture>
            );
          case "likeVisible":
            return typeOfTool.value?.isLikeVisible? (
              <LuEye className={`${isDark?'customWhite':'customWhite'} text-lg inline-block align-middle`} />
            ) : (
              <LuEyeOff className={`${isDark?'customWhite':'customWhite'} text-lg inline-block align-middle`} />
            );
          case "replyAllowed":
            return typeOfTool.value?.isReplyAllowed? (
              <PiChatLight className={`${isDark?'customWhite':'customWhite'} text-lg inline-block align-middle`} />
            ) : (
              <PiChatSlash className={`${isDark?'customWhite':'customWhite'} text-lg inline-block align-middle`} />
            );
            case "postMenu":
              return <FaEllipsis className={`${isDark?'customWhite':'customWhite'} block  align-middle`}></FaEllipsis>
            case "SpecificPage":
              return <IoIosArrowDropdown className={`${isDark?'customWhite':'customWhite'} text-2xl block  align-middle`}></IoIosArrowDropdown>
          default:
            return null; // 기본값 (렌더링 안 함)
        }
    }

    const filteredValue = () =>{
      const value = typeOfTool.value;
      const type = typeOfTool.type;
      if(type ==='like'){
        if(value.numberValue){
          return value.numberValue
        }
      }
      else if(type === 'reply'){
        if(value.numberValue>0){
          return value.numberValue
        }else{
          return null
        }
      }
    }

    const sendValue= (event: React.MouseEvent<HTMLDivElement>)=>{
      handleOnClick(event,typeOfTool.type);
    }

return (
    <div onClick={sendValue}className={`flex w-full h-full items-center justify-center transform duration-300 group-hover:scale-110 cursor-pointer ${isDark ?'text-hovercustomWhite':'text-hovercustomBlack'} `}>
    {renderIcon()}
    <div className='h-6'>
    <span className='text-sm inline-block align-baseline'>{filteredValue()}</span>
    </div>
</div>
);
}



export default PostTool;