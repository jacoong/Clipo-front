import { useTheme } from "../../../customHook/useTheme"
import MenuList from "../../MenuList";
import { useNavigate } from "react-router-dom";
import useModal from "../../../customHook/useModal";
const NavBarMenu = ({value}:any) =>{

    console.log(value);
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const {format,right,top,locationValue} = value;
    const { closeModal } = useModal();
   
    const handleOnClick = (type:string)=>{
        console.log(type)
        if(type === 'Recommand'){
            navigate('/main')
        }else if(type === 'FollowingPost'){
            navigate('/main/followingPost')
        }else if(type === 'LikePost'){
            navigate('/main/likedPost')
        }
        closeModal()
    }
    
    return(
        <div style={{ right: `${right}`, top:`${top}`}}  className={`z-30 p-2  w-auto h-auto  border ${isDark?'bg-customLightBlack':'bg-customRealWhite'} ${isDark?'border-customLightGray':'border-customGray'} overflow-hidden rounded-2xl  absolute`}>
        <MenuList handleOnClick={handleOnClick} menuArray={format}></MenuList>
        </div>
    )
}

export default NavBarMenu;