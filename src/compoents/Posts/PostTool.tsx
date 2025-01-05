import React, {ReactNode} from 'react';
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

interface typeOfPostTool {
        typeOfTool:{
          type:string;
          value:any
        };
        isDark:boolean;
        handleOnClick:(event: React.MouseEvent<HTMLDivElement>,type:string) => void;
}

const PostTool =({typeOfTool,handleOnClick,isDark}:typeOfPostTool) => {

    const renderIcon = () => {
        switch (typeOfTool.type) {
          case "reply":
            return <FaRegComment className='text-lg inline-block align-middle'/>;
          case "like":
            return typeOfTool.value?.isLike? (
              <AiFillHeart className="text-customRed text-lg inline-block align-middle" />
            ) : (
              <AiOutlineHeart className="text-lg inline-block align-middle" />
            );
          case "linkCopy":
            return <>
            <TbSend2 className='text-lg inline-block align-middle'/>
            </>
          case "tag":
            return(
              <FaHashtag className="text-lg inline-block align-middle" />
            );
          case "morePicture":
            return typeOfTool.value?.isLike? (
              <AiOutlinePicture className="text-lg inline-block align-middle" />
            ) : (
              <AiOutlinePicture className="text-lg inline-block align-middle">
                <p>추가</p>
              </AiOutlinePicture>
            );
          case "likeVisible":
            return typeOfTool.value?.isLikeVisible? (
              <LuEye className="text-lg inline-block align-middle" />
            ) : (
              <LuEyeOff className="text-lg inline-block align-middle" />
            );
          case "replyAllowed":
            return typeOfTool.value?.isReplyAllowed? (
              <PiChatLight className="text-lg inline-block align-middle" />
            ) : (
              <PiChatSlash className="text-lg inline-block align-middle" />
            );
            case "postMenu":
              return <FaEllipsis className='block  align-middle'></FaEllipsis>
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