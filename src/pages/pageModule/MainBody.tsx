import { useTheme } from "../../customHook/useTheme"
import react, {ReactNode} from 'react'

interface MainBodyProps {
    children: ReactNode; // children을 props의 일부로 정의
  }

const MainBody = ({children}:MainBodyProps) => {

    const { isDark } = useTheme();

    return (
        <div className={`w-full flex flex-col ${isDark?'bg-hovercustomBlack':'bg-hovercustomWhite'} border ${isDark?'border-customLightGray':'border-customGray'} overflow-hidden rounded-t-2xl`}>
            {/* 여기에 콘텐츠 추가 */}
            <div className="flex-1">
            {children}
            </div>
        </div>
        )
    }

export default MainBody