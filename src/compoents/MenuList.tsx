import {useTheme} from '../customHook/useTheme';
import { GoHomeFill,GoHome,GoHeart,GoHeartFill } from "react-icons/go";
import { RiUserFollowLine,RiUserUnfollowLine } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import { IoCopyOutline } from "react-icons/io5";
import { AiOutlineEye,AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineCommentsDisabled,MdOutlineComment,MdOutlineModeEditOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { Border_color_Type,Bg_color_Type_1,Font_color_Type_1,Bg_color_Type_3,hover_color_Type } from '../store/ColorAdjustion';

interface typeOFMenuList {
    type:string,
    value:string,
    isSelected?:boolean;

}

interface MenuListProps {
    menuArray: typeOFMenuList[];
    handleOnClick:(type:string)=> void;
    isMobile?:boolean;
    isDark?: boolean;
  }

const MenuList = ({menuArray,handleOnClick,isMobile=false,isDark=true}:MenuListProps)=>{

  console.log(menuArray,isMobile)
  const renderIcon = (list:typeOFMenuList) => {
    switch (list.type) {
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
                case "Recommand":
                  case "FollowingPost":
                  case "LikePost":
                    return list?.isSelected ? <FaCheck /> : null;
                
                  default:
                    return null;
}
}

  


  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };


return(
    <>{
        menuArray.map((list,index)=>((
        
      <div onClick={()=>handleOnClick(list.type)} className={`${hover_color_Type(isDark)} ${Bg_color_Type_1(isDark)} md:bg-inherit mb-4 md:mb-2 cursor-pointer  flex justify-between  w-full  md:w-56 p-4 md:p-3 rounded-xl  transition-colors duration-300`}>
        <p className={`${Font_color_Type_1(isDark)}`}>{list.value}</p>
        <div className={`text-2xl ${Font_color_Type_1(isDark)}`}>
        {renderIcon(list)}
        </div>
        </div>
    )))
}
    </>

)
}











export default MenuList;