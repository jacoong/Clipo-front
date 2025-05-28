import { useTheme } from "../../../customHook/useTheme"
import react, {ReactNode} from 'react'

interface MainBodyProps {
    children: ReactNode; // children을 props의 일부로 정의
  }

const MainBody = ({children}:MainBodyProps) => {

    const { isDark } = useTheme();

    return (
        <div     className={`
            w-full h-[calc(100vh-6rem)]
            flex flex-col 
            ${isDark ? 'bg-customLightBlack' : 'bg-customRealWhite'} 
            border 
            ${isDark ? 'border-customLightGray' : 'border-customGray'} 
            rounded-t-2xl
            overflow-hidden
          `}
          >
            {/* 여기에 콘텐츠 추가 */}
            <div className="flex-1 overflow-y-auto">
            {children}
            </div>
        </div>
        )
    }

export default MainBody