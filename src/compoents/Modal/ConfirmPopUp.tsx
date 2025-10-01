import React, {ReactNode,useEffect} from 'react';
import { Bg_color_Type_1, Border_color_Type} from '../../store/ColorAdjustion';
import TransitionDiv from '../TransitionDiv';
import {Font_color_Type_1,Bg_color_Type_2} from "../../store/ColorAdjustion";
import { ConfirmPopupListValue ,buttonType} from '../../store/types';
interface ValueOfComfirmPopUp {
    title:string;
    text:string;
    list:ConfirmPopupListValue[];  
    isDark:boolean;
    anchorClick:(type:string)=>void;
}


const getButtonStyles = (type:buttonType = 'normal', isDark: boolean) => {
    // 특별한 타입들은 고정 스타일

    const specialStyles:any = {
        delete: 'text-red-500',
        logout: 'text-red-500',
        confirm: 'text-green-500',
        normal:
         `${Font_color_Type_1(isDark)}`
    };
      
      // 특별한 타입이면 고정 스타일 반환

    return specialStyles[type];

    };



const ConfirmPopUp =({title,text,list,isDark,anchorClick}:ValueOfComfirmPopUp) => {


const handleClick = (type:string)=>{
    anchorClick(type);
}

      

return (
    <div className='rounded-xl p-1'>
        <div  className="p-5 w-full text-center ">
        <div className='pb-3'>
            <p className={`font-extrabold ${Font_color_Type_1(isDark)}`}>{title}</p>
      </div>
      <div>
        <p className={`${Font_color_Type_1(isDark)}`}>{text}</p>
      </div>
    </div>
    {list.map((item, index: number) => (
  <TransitionDiv key={index}  isDark={isDark}>
 <div
            key={`${item.type}-${index}`}
            onClick={() => anchorClick(item.type)}
            className={`
            ${Border_color_Type(isDark)} w-full py-4 px-6 text-center font-medium transition-colors duration-200
              ${getButtonStyles(item.type, isDark)}
              ${index < list.length - 1 ? 'border-t border-b'  : 'border-none'}
              focus:outline-none focus:ring-2 focus:ring-offset-2
            `}
          >
            {item.text}
          </div>
  </TransitionDiv>
))}
    </div>
);
}



export default ConfirmPopUp;