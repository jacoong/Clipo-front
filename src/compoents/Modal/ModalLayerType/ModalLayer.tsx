import ClosedButton from "../ClosedButton";
import { IoCloseOutline } from "react-icons/io5";
import useModal from "../../../customHook/useModal";
import React, { ReactNode } from 'react';
import { useTheme } from "../../../customHook/useTheme";


type ChildrenProps = {
    children: ReactNode;
    isCenterMessage?: string;
    isCloseButtonShow?: boolean;
    width?:string;
    isDark?:boolean;
}


function ModalLayer({isDark,width='w-auto',children,isCenterMessage,isCloseButtonShow=true}:ChildrenProps){

    const  { closeModal } = useModal();


    const handleClosed = () => {
        closeModal();
      };
     
return(
    <div className= {`${isDark ? 'bg-hovercustomBlack' : 'bg-white'} h-auto ${width} flex flex-col px-1 pt-2 rounded-xl`}>
        <div className={`flex justify-between items-center w-full box-border`}>
        <div className={'w-8'}>

        </div>

        {isCenterMessage?
            <div className={''}>
            <h1>{isCenterMessage}</h1>
            </div>:
                <div className={'w-8'}>

                </div>
        }
 
        {isCloseButtonShow?
                <ClosedButton onClick={handleClosed}>
                <IoCloseOutline></IoCloseOutline>
                </ClosedButton>
                :
                <div className={'w-8'}>

                </div>
        }


        </div>
        <div className="p-3">
        {children}
        </div>
    </div>
   

)
}

export default ModalLayer;