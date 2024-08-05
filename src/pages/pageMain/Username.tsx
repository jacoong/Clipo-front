import { useTheme } from "../../customHook/useTheme"



const Username = () => {

    const { isDark } = useTheme();

    return (
        <div className={`w-full h-overHeight flex flex-col ${isDark?'bg-hovercustomBlack':'bg-hovercustomWhite'} border ${isDark?'border-customLightGray':'border-customGray'} rounded-t-2xl overflow-hidden p-5`}>
            Username
        </div>
        )
    }

export default Username