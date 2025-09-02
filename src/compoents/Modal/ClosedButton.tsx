import style from '../pages/css/ClosedButton.module.css'
import { IoCloseOutline } from "react-icons/io5";
import react, {ReactNode} from 'react'
import { useTheme } from "../../customHook/useTheme";
import { Font_color_Type_1 } from '../../store/ColorAdjustion';
type ClosedButtonType = {
    onClick?:any
    children: ReactNode;
};


const ClosedButton =({onClick,children}:ClosedButtonType) => {


  const { isDark } = useTheme();

return (
    <div className='min-h-8 flex items-center' onClick={onClick}>
    <div className={`rounded-full w-8 h-8 flex items-center justify-center transition ease-in-out duration-200 ${Font_color_Type_1(isDark)} hover:bg-customBlue`} >
        {children} 
    </div>
</div> 
);
}



export default ClosedButton;