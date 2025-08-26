import React,{ReactNode,useState,useEffect} from 'react';
import {flashMessageValue} from '../store/types';
import { useFlashMessage } from '../customHook/useFlashMessage';
import { useTheme } from '../customHook/useTheme';
import { FcInfo,FcOk,FcHighPriority,FcSynchronize } from "react-icons/fc";
import { Bg_color_Type_3,Border_color_Type } from '../store/ColorAdjustion';

interface typeOfFlashMessage {
    duration?:number;
    persistOnHover?:boolean;
    value:flashMessageValue|null;
}

const FlashMessage = ({duration=1500,persistOnHover=true,value}:typeOfFlashMessage) => {
    const {clearFlashMessage} = useFlashMessage();
    const { isDark } = useTheme();
    const [isHovering, setIsHovering] = useState(false);
    
    useEffect(() => {
     
        if (value === null) return;
    
        let timeoutId: NodeJS.Timeout;
    
        const startTimer = () => {
          timeoutId = setTimeout(() => {
            if (!isHovering) {
              clearFlashMessage();
            }
          }, duration);
        };
    
        // Hover 상태가 아닐 때만 타이머 시작
        if (!isHovering) {
          startTimer();
        }
    
        // Hover 중이면 타이머를 초기화
        return () => {
          clearTimeout(timeoutId);
        };
      }, [isHovering, value, duration, clearFlashMessage]);


      const renderIcon = () =>{
        const type = value?.typeOfFlashMessage;
        switch(type){
            case 'success':
                return <FcOk className='text-5xl'></FcOk>
            case 'caution':
                return <FcSynchronize className='text-5xl'> </FcSynchronize>
            case 'error':
                return <FcHighPriority className='text-5xl'></FcHighPriority>
            case 'brand':
                return  <FcInfo className='text-5xl'></FcInfo>
        }
      }


        //selector => true 

    return(
        value !== null ?
            <div  
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="z-10 fixed bottom-32 transform -translate-x-1/2 left-1/2 w-auto max-w-220px flex justify-center h-auto">
                <div className={`flex ${Bg_color_Type_3(isDark)} border ${Border_color_Type(isDark)} rounded-2xl  `}>
                    <div className="flex" role="alert">
                        <div className='flex px-4 py-5'>
                        {renderIcon()}
                        </div>
                        <div className='flex flex-col h-full justify-center pr-4'>
                            <div><strong className="font-bold">{value.title}</strong> </div>
                            <div> <span className="block sm:inline">{value.subTitle}</span></div>
                        </div>
                    </div>

                    <div onClick={()=>{clearFlashMessage()}} className={`cursor-pointer flex justify-center items-center w-24 border-l ${Border_color_Type(isDark)}`}>
                        <span className="relative">
                         OK  
                        </span>
                    </div>
                </div>
     
            </div>
            :
            null
    )
};


export default FlashMessage;