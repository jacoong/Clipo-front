import { useTheme } from "../../customHook/useTheme"
import { useEffect,useState } from "react";

interface LoadingProps {
    isLoaded: boolean; // props 타입 정의
}

const Loading = ({isLoaded}:LoadingProps) => {

    const { isDark } = useTheme();
    const [isStartAnimation, setIsStartAnimation] = useState(false);
    const [zIndex, setZIndex] = useState(30);


    const handleAnimation = () => {
        setTimeout(() => {
          setZIndex(0); // duration-500 이후 z-index 변경
        }, 500); // 500ms (애니메이션 시간) 후에 실행
      };

    useEffect(()=>{
        if(isLoaded === false){
                setIsStartAnimation(true)
            return
        }
    },[isLoaded])

    useEffect(() => {
        if (isStartAnimation) {
        handleAnimation();
        }
      }, [isStartAnimation]);

    return (
        <div
        className={`fixed w-full h-lvh flex items-center justify-center 
            ${isDark ? 'bg-hovercustomBlack' : 'bg-hovercustomWhite'} 
            border ${isDark ? 'border-customLightGray' : 'border-customGray'} 
            rounded-t-2xl overflow-hidden p-5 z-${zIndex}
            ${isStartAnimation ? 'opacity-0 transition-opacity duration-500' : 'opacity-100 transition-opacity duration-500'}
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