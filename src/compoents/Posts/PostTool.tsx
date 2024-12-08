import React, {ReactNode} from 'react';
import { FaRegComment } from "react-icons/fa";
import { AiOutlineHeart,AiFillHeart, AiOutlineDelete } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";


interface typeOfPostTool {
        typeOfTool:{
          type:string;
          value:{
            isLike?:boolean;
            numberValue:number
          }|null;
        };
        isDark:boolean;
        handleOnClick:(event: React.MouseEvent<HTMLDivElement>) => void;
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
          case "edit":
            return <FiEdit3 className='text-lg inline-block align-middle'/>;
          case "delete":
            return <AiOutlineDelete className='text-lg inline-block align-middle'/>;
          default:
            return null; // 기본값 (렌더링 안 함)
        }
    }

return (
    <div onClick={handleOnClick}className={`cursor-pointer ${isDark ?'text-hovercustomWhite':'text-hovercustomBlack'} flex`}>
    <div className=' h-6 pr-1'>
    {renderIcon()}
    </div>
    <div className='h-6'>
    <span className='text-sm inline-block align-baseline'>{typeOfTool.value?.numberValue ? typeOfTool.value?.numberValue :null}</span>
    </div>
</div>
);
}



export default PostTool;