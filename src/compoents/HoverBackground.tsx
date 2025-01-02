import React, { ReactNode } from 'react';
import { useTheme } from "../customHook/useTheme"

interface HoverBackgroundProps {
    children:ReactNode
    handleClick?:()=>void;
    px?:string;
    py?:string;
    scale?:number;
}

const HoverBackground: React.FC<HoverBackgroundProps> = ({
    children,
    handleClick,
    scale = 10,
    px='px-1',
    py='py-1'
}) => {
  const dynamicScaleClass = `w-${scale} h-${scale}`;
  const { isDark } = useTheme();


  return (
    <div className={`relative ${px} ${py} flex items-center justify-center group`}>
    <div className={`absolute ${dynamicScaleClass} rounded-3xl bg-transparent transform scale-100 duration-300 group-hover:scale-110 ${isDark?'group-hover:bg-hovercustomBlack':'group-hover:bg-hoverLightGray'}`}/>
    <div className='relative w-10 h-10 flex items-center justify-center'>
        {children}
    </div>
    </div>
  );
};

export default HoverBackground;
