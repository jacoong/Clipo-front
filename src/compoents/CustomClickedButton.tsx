import style from '../pages/css/ClosedButton.module.css'
import { IoCloseOutline } from "react-icons/io5";
import react, {ReactNode} from 'react'
import { useTheme } from "../customHook/useTheme";


type ClosedButtonType = {
    onClick?:any
    children: ReactNode;
};


const CustomClickedButton =({onClick,children}:ClosedButtonType) => {


  const { isDark } = useTheme();

return (
    <div className={`cursor-pointer transition ease-in-out duration-200 scale-110 border rounded-full ${isDark?'border-customLightGray':'border-customGray'}`} onClick={onClick}>
    <div className={`w-8 h-8 flex items-center justify-center`} >
        {children} 
    </div>
</div> 
);
}



export default CustomClickedButton;