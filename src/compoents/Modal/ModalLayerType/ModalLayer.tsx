import ClosedButton from "../ClosedButton";
import useModal from "../../../customHook/useModal";
import React, { ReactNode } from 'react';
import { useTheme } from "../../../customHook/useTheme";
import {ModalOptions} from '../../../store/types';
import { IoCloseOutline,IoTrashOutline,IoPencil } from "react-icons/io5";
import { Border_color_Type, Font_color_Type_1 } from '../../../store/ColorAdjustion';
import { SiTrueup } from "react-icons/si";


function ModalLayer({width,isDark,height,isFull,children,isCenterMessage,navButtonOption,isConfirmClosed}:ModalOptions){

    const  { closeModal,openModal } = useModal();
    const options = navButtonOption ?? {};

    const handleClosed = () => {
        if(isConfirmClosed){
        // 닫기 확인 모달만 열고, 현재 모달은 닫지 않음
        openModal({type:'confirmCloseModal', props:{isForce:true,isDark:isDark}})
        }else{
        // 닫기 확인이 없을 때만 현재 모달 닫기
        closeModal();
      }
      };

      const handleEdit = () => {
        closeModal();
      };

      const handleDelete = () => {
        closeModal();
      };
     
      const renderButtons = () => {
        const buttons = [];
    

        if (options.isDelete) {
          buttons.push(
            <ClosedButton key="delete" onClick={handleDelete}>
              <IoTrashOutline />
            </ClosedButton>
            
          );
        }
      
    
        if (options.isEdit) {
          buttons.push(
            <ClosedButton key="edit" onClick={handleEdit}>
              <IoPencil />
            </ClosedButton>
          );
        }
    
        if (options.isClose) {
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

    const containerClasses = `flex flex-col w-full ${isFull ? 'h-full' : ''} ${isFull ? '' : 'rounded-xl'} ${height ?? ''}`;

return(
    // <div className= {`${isDark ? 'bg-hovercustomBlack' : 'bg-customRealWhite  border-customGray'} ${height} ${width} flex flex-col px-1 pt-2 rounded-xl`}>
    <div className={containerClasses}>
        <div className={`p-3 flex justify-between items-center w-full box-border`}>
        <div className={'w-8'}>

        </div>

        {isCenterMessage ?
            <div className={'px-1'}>
            <h1 className={Font_color_Type_1(isDark ?? false)}>{isCenterMessage}</h1>
            </div>:
                <div className={'w-8'}>

                </div>
        }
 
        <div className={'cursor-pointer text-2xl flex justify-between'}>
            {renderButtons()}
        </div>


        </div>
      <div className={`border-t ${Border_color_Type(isDark ?? false)} h-full overflow-y-auto`}>
        {children}
        </div>
    </div>
   

)
}

export default ModalLayer;
