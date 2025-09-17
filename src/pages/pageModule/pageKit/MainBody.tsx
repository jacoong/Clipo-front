import { useTheme } from "../../../customHook/useTheme"
import react, {ReactNode} from 'react'
import { Border_color_Type } from "../../../store/ColorAdjustion";
import ShadowDiv from "../../../store/ShadowDiv";

interface MainBodyProps {
    children: ReactNode; // children을 props의 일부로 정의
  }

const MainBody = ({children}:MainBodyProps) => {

    const { isDark } = useTheme();

    return (
        <div     className={`
         
            w-full h-[calc(100vh-6rem)]
            flex flex-col 
            ${isDark ? 'bg-customLightBlack':'bg-customRealWhite'} 
            border
            ${Border_color_Type(isDark)}
            rounded-t-2xl
          `}
          >
            {/* 여기에 콘텐츠 추가 */}
            <div className="rounded-t-2xl flex-1 overflow-y-auto    scrollbar-hide">

                {children}
          
            </div>
        </div>
        )
    }

export default MainBody