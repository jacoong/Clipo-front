import { useTheme } from "../../customHook/useTheme"

const MainBody = () => {

    const { isDark } = useTheme();

    return (
        <div className={`w-full h-overHeight flex flex-col ${isDark?'bg-hovercustomBlack':'bg-hovercustomWhite'} border ${isDark?'border-customLightGray':'border-customGray'} rounded-t-2xl overflow-hidden p-5`}>
            {/* 여기에 콘텐츠 추가 */}
            <div className="flex-1">
                {/* 콘텐츠가 여기에 들어갑니다. */}
            </div>
        </div>
        )
    }

export default MainBody