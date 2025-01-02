import {useTheme} from '../customHook/useTheme';
import { GoHomeFill,GoHome,GoHeart,GoHeartFill } from "react-icons/go";
import { RiUserFollowLine,RiUserUnfollowLine } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineEye,AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineCommentsDisabled,MdOutlineComment,MdOutlineModeEditOutline } from "react-icons/md";
interface typeOFMenuList {
    type:string,
    value:string
}

interface MenuListProps {
    menuArray: typeOFMenuList[];
    handleOnClick:(type:string)=> void;
  }

const MenuList = ({menuArray,handleOnClick}:MenuListProps)=>{


  const renderIcon = (type:string) => {
    switch (type) {
      case "edit":
        return <MdOutlineModeEditOutline/>;
      case "unfollow":
        return <RiUserUnfollowLine className='text-customRed'/>;
        case "follow":
          return <RiUserFollowLine className='text-customBlue'/>;
      case "linkCopy":
        return   <IoCopyOutline/>
        case "delete":
          return   <TiDeleteOutline className='text-customRed'/>
          case "disableComment":
            return   <MdOutlineCommentsDisabled/>
            case "ableComment":
              return   <MdOutlineComment/>
            case "disableShowNumberOfLike":
              return   <AiOutlineEyeInvisible/>
              case "ableShowNumberOfLike":
                return   <AiOutlineEye/>
      default:
        return null; // 기본값 (렌더링 안 함)
    }
}

  
  // props를 콘솔에 출력 (선택사항)
  const { isDark } = useTheme();
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };


return(
    <>{
        menuArray.map((list,index)=>((
      <div onClick={()=>handleOnClick(list.type)} className={`cursor-pointer flex justify-between w-56 p-3 rounded-xl bg-inherit ${
        isDark ? 'hover:bg-hovercustomBlack' : 'hover:bg-hoverLightGray'
      } transition-colors duration-300`}>
        <p>{list.value}</p>
        <div className='text-2xl'>
        {renderIcon(list.type)}
        </div>
        </div>
    )))
}
    </>

)
}

export default MenuList;