import { useTheme } from "../../customHook/useTheme"
import { useEffect,useState } from "react";

interface LoadingProps {
    isLoaded: boolean; // props 타입 정의
}

const Loading = ({isLoaded}:LoadingProps) => {

    const { isDark } = useTheme();
    const [isStartAnimation, setIsStartAnimation] = useState(false);

    useEffect(()=>{
        if(isLoaded === false){
            setTimeout(() => {
                setIsStartAnimation(true)
            }, 500);
            return
        }
    },[isLoaded])

    return (
        <div
        className={`fixed z-30 w-full h-lvh flex items-center justify-center 
            ${isDark ? 'bg-hovercustomBlack' : 'bg-hovercustomWhite'} 
            border ${isDark ? 'border-customLightGray' : 'border-customGray'} 
            rounded-t-2xl overflow-hidden p-5 
            ${isStartAnimation ? 'opacity-0 transition-opacity duration-500' : 'opacity-100'}
        `}
    >
        <img
            className={`w-60 h-56 
                ${isStartAnimation ? 'scale-125 transition-transform duration-500' : 'scale-100'}
            `}
            src='./logo3.png'
            alt="Loading Logo"
            style={{ zIndex: isStartAnimation ? 0 : 1 }} // z-index 조건부 적용
        />
    </div>
        )
    }

export default Loading;