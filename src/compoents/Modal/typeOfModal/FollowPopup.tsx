import React, {ReactNode,useEffect,useState} from 'react';
import { useTheme } from '../../../customHook/useTheme';
import PageNationStandard from '../../../pages/pageModule/pageKit/PageNationStandard.tsx';
import SearchTagPagenation from '../../../pages/pageModule/pageKit/SearchTagPagenation';
import { hover_color_Type, Font_color_Type_1, Border_color_Type } from '../../../store/ColorAdjustion';
type typeOfFilterType ='Following'|'Follower';

interface TypeFollowPopup{
    typeOfFilter:typeOfFilterType,
    username:string,
    numberOfFollower:number,
    numberOfFollowing:number
}

interface FollowPopupProps {
    value: TypeFollowPopup;
    isFullScreen?: boolean;
}

const FollowPopup =({value,isFullScreen = false}:FollowPopupProps) => {
    const {typeOfFilter,username,numberOfFollower,numberOfFollowing} = value;
    const TYPEOFVALUES:typeOfFilterType[] = ['Follower','Following'];
    const { isDark } = useTheme();
    console.log(typeOfFilter,username,numberOfFollower,numberOfFollowing);
    const [typeOfFilterValue,setTypeOfFilterValue] = useState<typeOfFilterType>(typeOfFilter);

    const handleChangeFilterdValue = (item:typeOfFilterType) =>{
        console.log(item,'itemvalue')
        setTypeOfFilterValue(item)
    }

    useEffect(()=>{
        if(typeOfFilter){
            setTypeOfFilterValue(typeOfFilter)
        }
    },[typeOfFilter])

    const containerClass = `${isFullScreen ? 'min-h-screen' : 'h-116'} flex flex-col relative`;

return (
    <div className={containerClass}>
        <div className={`h-[50px] w-full flex justify-between ${Border_color_Type(isDark)} border-b`}>
            {TYPEOFVALUES.map((item:typeOfFilterType, num) => (
                <div
                    key={`${num}follow`}
                    onClick={() => handleChangeFilterdValue(item)}
                    className={`${hover_color_Type(isDark)} w-1/2 flex justify-center items-center cursor-pointer   mx-1`}
                >
                    <div
                        className={`h-full flex items-center font-semibold px-4 py-2  ${
                            item === typeOfFilterValue 
                                ? `border-b-2 border-themeColor bg-opacity-10 ${Font_color_Type_1(isDark)} font-bold` 
                                : `${Font_color_Type_1(isDark)} opacity-70 hover:opacity-100`
                        }`}
                    >
                        <span className="text-sm">{item}</span>
                    </div>
                </div>
            ))}
        </div>
        <div className='flex-1 overflow-auto'>
            <SearchTagPagenation isDark={isDark} typeOfFilter={typeOfFilterValue} username={username} />
        </div>
    </div>
);
}



export default FollowPopup;
