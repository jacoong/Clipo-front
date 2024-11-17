import ClosedButton from "../ClosedButton";
import useModal from "../../../customHook/useModal";
import React, { ReactNode } from 'react';
import { useTheme } from "../../../customHook/useTheme";
import {ModalOptions} from '../../../store/types';
import { IoCloseOutline,IoTrashOutline,IoPencil } from "react-icons/io5";



function ModalLayer({width,isDark,height,isFull,children,isCenterMessage,navButtonOption}:ModalOptions){

    const  { closeModal } = useModal();

    console.log(isDark)
    const handleClosed = () => {
        closeModal();
      };

      const handleEdit = () => {
        closeModal();
      };

      const handleDelete = () => {
        closeModal();
      };
     
      const renderButtons = () => {
        const buttons = [];
    

        if (navButtonOption!.isDelete) {
          buttons.push(
            <ClosedButton key="delete" onClick={handleDelete}>
              <IoTrashOutline />
            </ClosedButton>
            
          );
        }
      
    
        if (navButtonOption!.isEdit) {
          buttons.push(
            <ClosedButton key="edit" onClick={handleEdit}>
              <IoPencil />
            </ClosedButton>
          );
        }
    
        if (navButtonOption!.isClose) {
          buttons.push(
            <ClosedButton key="close" onClick={handleClosed}>
              <IoCloseOutline />
            </ClosedButton>
          );
        }
    
        // 모든 버튼이 없는 경우, placeholder를 렌더링합니다.
        if (buttons.length === 0) {
          return <div className={'w-8'}></div>;
        }
    
        return buttons;
      };

return(
    <div className= {`${isDark ? 'bg-hovercustomBlack' : 'bg-white'} ${height} ${width} flex flex-col px-1 pt-2 rounded-xl`}>
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
 
        <div className={'flex justify-between'}>
            {renderButtons()}
        </div>


        </div>
        <div className="p-3">
        {children}
        </div>
    </div>
   

)
}

export default ModalLayer;