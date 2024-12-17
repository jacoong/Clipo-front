import React, { ReactNode } from 'react';
import { useTheme } from "../customHook/useTheme"

interface HoverBackgroundProps {
    children:ReactNode
    handleClick?:()=>void;
    px?:string;
    py?:string;
}

const HoverBackground: React.FC<HoverBackgroundProps> = ({
    children,
    handleClick,
    px='px-1',
    py='py-1'
}) => {

  const { isDark } = useTheme();


  return (
    <div className={`relative ${px} ${py} flex items-center justify-center group`}>
    <div className={`absolute w-full h-full rounded-3xl bg-transparent transform scale-100 duration-300 group-hover:scale-100 ${isDark?'group-hover:bg-hovercustomBlack':'group-hover:bg-hoverLightGray'}`}/>
    <div className='relative h-full flex items-center justify-center'>
        {children}
    </div>
    </div>
  );
};

export default HoverBackground;
