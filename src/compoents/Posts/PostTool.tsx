import React, {ReactNode} from 'react';
import { FaRegComment } from "react-icons/fa";
import { AiOutlineHeart, AiOutlineDelete } from "react-icons/ai";
import { FiEdit3 } from "react-icons/fi";

interface typeOfPostTool {
        type:string;
        value:null|number;
}

const PostTool =({typeOfTool}:{typeOfTool:typeOfPostTool}) => {

    const renderIcon = () => {
        switch (typeOfTool.type) {
          case "reply":
            return <FaRegComment />;
          case "like":
            return <AiOutlineHeart />;
          case "edit":
            return <FiEdit3 />;
          case "delete":
            return <AiOutlineDelete />;
          default:
            return null; // 기본값 (렌더링 안 함)
        }
    }

return (
    <div className='flex h-full align-middle mr-3 transition-colors duration-300 ease-in-out bg-your-color'>
    <div className='pointer w-9 h-full rounded-full flex align-middle justify-center'>
    {renderIcon()}
    </div>
    <div className='relative h-full align-middle'>
    <p>{typeOfTool.value ? typeOfTool.value :null}</p>
    </div>
</div>
);
}



export default PostTool;