import React, {ReactNode,useEffect,useState} from 'react';
import { useTheme } from '../../../customHook/useTheme';
import PageNationStandard from '../../../pages/pageModule/pageKit/PageNationStandard.tsx';
import SearchTagPagenation from '../../../pages/pageModule/pageKit/SearchTagPagenation';

type typeOfFilterType ='Following'|'Follower';

interface TypeFollowPopup{
    typeOfFilter:typeOfFilterType,
    username:string,
    numberOfFollower:number,
    numberOfFollowing:number
}

const FollowPopup =({value}:any) => {
    const {typeOfFilter,username,numberOfFollower,numberOfFollowing}:TypeFollowPopup = value;
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

return (
    <div className='h-116 flex flex-col relative'>
            <div className="h-[45px] mt-2 box-border  w-full flex justify-between border-b-[0.5px] border-[#EFF3F4]">
            {TYPEOFVALUES.map((item:typeOfFilterType, num) => (
            <div
                key={`${num}follow`}
                onClick={() => handleChangeFilterdValue(item)}
                className="w-1/2 flex justify-center items-center cursor-pointer transition-colors duration-500 ease-in-out hover:bg-[#EAEAEA]"
            >
                <div
                className={`h-full flex items-center font-semibold ${item === typeOfFilterValue ? 'border-b-4 border-customBlue font-black px-[6px] transition-all duration-100 ease-in-out' : ''}`}
                >
                <span>{item}</span>
                </div>
            </div>
            ))}
        </div>
        <div className='flex-1 overflow-auto '>
        <SearchTagPagenation isDark={isDark} typeOfFilter={typeOfFilterValue} username={username} ></SearchTagPagenation>
        </div>
    </div>
);
}



export default FollowPopup;