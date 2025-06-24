import React, {ReactNode} from 'react';
import style from '../compoents/compoentsCss/Button.module.css';
import { useTheme } from '../customHook/useTheme';
import Loading from './Loading';
type ButtonType = {
    background_color?:string;
    width?:string;
    margin?:string;
    height?:string;
    padding?:string;
    isLoading?:boolean;
    bolder?:string;
    color?:string;
    borderRadius?:string;
    handleClick?:(e: React.MouseEvent<HTMLButtonElement>) => void;
    children:ReactNode;
    disabled?:boolean;
    type?:"button" | "submit" | "reset" | undefined
};


const Button =({isLoading=false,margin,bolder='thin', padding='14px',borderRadius='24px', type='submit',background_color='b-theme',width='300px',color='white',handleClick,disabled= false,children}:ButtonType) => {
    const { isDark } = useTheme();
    
    const buttonStyle={
        padding:padding,
        width:width,
        borderRadius:borderRadius,
        color:color,
        disabled:disabled,
        margin:margin
        
    }

return (
    isLoading?

    <div style={buttonStyle} 
className={`${style.button}  ${style[bolder]} ${isDark ? 'text-customWhite' :'text-customWhite'} ${style[background_color]} ${style[width]}`}>
<Loading/>
</div>  


 
    :

    <button style={buttonStyle} className={`${style.button}  ${style[bolder]} ${isDark ? 'text-customWhite' :'text-customWhite'} ${style[background_color]} ${style[width]}`}
    onClick={handleClick}
    disabled={disabled}
    type={type}
    >
    {children}
    </button>   

);
}



export default Button;