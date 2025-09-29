import React, { useState, useEffect } from 'react';
import { LuSun } from 'react-icons/lu';
import { MdOutlineNightsStay } from 'react-icons/md';
import {COLOR} from '../store/ThemeColor';
import { useTheme } from '../customHook/useTheme';
import { IoMdArrowBack } from "react-icons/io";
import HoverBackground from "../compoents/HoverEventCompoents/HoverBackground";

interface ThemeBarInterface  {
  handleOnClick?:(type:string)=> void;
}

const ThemeBar = ({handleOnClick}:ThemeBarInterface) => {

    const { isDark, toggleTheme ,setTheme} = useTheme();
    const [selectedOption,setSelectedOption] = useState<'white'|'dark'|'auto'>(isDark?'dark':'white');
    const ThemeArray = ['white', 'dark', 'auto'] as const;
    const renderIcon = (type:string) => {
        switch (type) {
          case "white":
            return <LuSun className={`text-xl transition-all duration-200 hover:scale-110 group-hover:scale-110 ${selectedOption === 'white'?isDark?'text-customWhite':'text-customBlack':isDark?'text-customGray':'text-customLightGray'}`}/>;
            case "dark":
              return <MdOutlineNightsStay className={`text-xl transition-all duration-200 hover:scale-110 group-hover:scale-110 ${selectedOption === 'white'?isDark?'text-customWhite':'text-customBlack':isDark?'text-customGray':'text-customLightGray'}`}/>;
              case "auto":
                return <p className={`transition-all duration-200 hover:scale-110 group-hover:scale-110 ${selectedOption === 'auto'?isDark?'text-customWhite':'text-customBlack':isDark?'text-customGray':'text-customLightGray'}`}>자동</p>;
          default:
            return null; // 기본값 (렌더링 안 함)
        }
    }

    const updateTheme = (theme:'white'|'dark'|'auto') => {
        setSelectedOption(theme); // 선택한 테마를 업데이트
        setTheme(theme);

      };

    return (
        // <div className='absolute bottom-20 right-20'>
        // <div
        //     onClick={toggleTheme}
        //     className={`group rounded-xl bg-customBlack px-5 py-3}`}
        // >
        //     {renderIcon(type)}

        // </div>
        // </div>



<div className={``}>
  {handleOnClick?
<div className="pb-3 flex justify-between items-center text-customGray relative">
  <div className="absolute left-0">
    <HoverBackground scale={7}>
    <IoMdArrowBack onClick={()=>handleOnClick('darkMode')} className={`cursor-pointer ${isDark?'text-customWhite':'text-customBlack'} transition-all duration-200 hover:scale-110`}/>
    </HoverBackground>
  </div>
  <div className={`flex ${isDark?'text-customWhite':'text-customBlack'} justify-center w-full`}>
    디자인
  </div>
 
</div>
:null
  }





<div className={`flex relative w-60 ${isDark?'bg-customBlack':'bg-customWhite'} rounded-xl`}>

<div
  className={`rounded-xl  scale-110 absolute w-20 h-full border ${isDark?'bg-customLightBlack':'bg-customRealWhite'} ${isDark?'border-customLightGray':'border-customGray'} border-1 flex transition-transform duration-300 ${
    selectedOption === 'white' ? 'translate-x-0' : 
    selectedOption === 'dark' ? 'translate-x-full' : 
    selectedOption === 'auto' ? 'translate-x-[200%]' : ''
  }`}>
    <div className=''></div>
</div>

{
    ThemeArray.map((list,index)=>(
    <div
    key={`themeBar${index}`}
    onClick={()=>updateTheme(list)}
    className={`cursor-pointer z-10 flex justify-center items-center w-20 py-2 group`}
    >
    {renderIcon(list)}
    </div>
))
}
</div>
</div>


    );
};

export default ThemeBar;