import { useTheme } from "../../../customHook/useTheme"
import MenuList from "../../MenuList";
import { useNavigate } from "react-router-dom";
import useModal from "../../../customHook/useModal";
import { Border_color_Type,Bg_color_Type_2, Bg_color_Type_1,Bg_color_Type_3} from "../../../store/ColorAdjustion";
const NavBarMenu = ({value}:any) =>{

    console.log(value);
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const {format} = value;
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
        <div className={`transform -translate-x-1/2 z-30 p-2  w-auto h-auto  border ${Bg_color_Type_3(isDark)} ${Border_color_Type(isDark)} overflow-hidden rounded-2xl`}>
        <MenuList handleOnClick={handleOnClick} menuArray={format}></MenuList>
        </div>
    )
}

export default NavBarMenu;