import { useMutation,useQueryClient } from "react-query";
import Services from '../../../store/ApiService';
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal'
import Button from '../../../compoents/Button';
import {useFlashMessage} from "../../../customHook/useFlashMessage";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import {Font_color_Type_1} from "../../../store/ColorAdjustion";
import TransitionDiv from "../../TransitionDiv";
import { Border_color_Type } from "../../../store/ColorAdjustion";
import { ConfirmPopupListValue } from "../../../store/types";
import ConfirmPopUp from "../ConfirmPopUp";

const { AuthService, UserService,SocialService } = Services;

const ConfirmClosedModal = ({isDark}:any)=>{
  const navigate = useNavigate();
    const {closeModal,closeAllModal} = useModal();
 
  const preventClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  }

  const handleListAction = (type:string)=>{
    if(type === 'delete'){
      closeAllModal();
    }else{
      closeModal();
    }
  }

  const ValueOfConfirmPopup: ConfirmPopupListValue[] = [
    { text: '팝업 닫기', type: 'delete' },
    { text: '취소하기', type: 'normal' }
  ];
  return(
    <div onClick={preventClick}>
    <ConfirmPopUp anchorClick={handleListAction}isDark={isDark} list={ValueOfConfirmPopup} title="정말 취소하시겠어요?" text="해당 팝업과 관련된 태그와 내용은 삭제됩니다" ></ConfirmPopUp>  
    </div>  
)

}
export default ConfirmClosedModal;