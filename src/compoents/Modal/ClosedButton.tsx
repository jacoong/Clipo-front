import style from '../pages/css/ClosedButton.module.css'
import { IoCloseOutline } from "react-icons/io5";
import react, {ReactNode} from 'react'
import { useTheme } from "../../customHook/useTheme";
type ClosedButtonType = {
    onClick?:any
    children: ReactNode;
};


const ClosedButton =({onClick,children}:ClosedButtonType) => {


  const { isDark } = useTheme();

return (
    <div className='min-h-8 flex items-center' onClick={onClick}>
    <div className={`rounded-full w-8 h-8 flex items-center justify-center transition ease-in-out duration-200 hover:bg-customBlue`} >
        {children} 
    </div>
</div> 
);
}



export default ClosedButton;