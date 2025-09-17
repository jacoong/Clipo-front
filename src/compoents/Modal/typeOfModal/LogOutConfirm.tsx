import { useMutation,useQueryClient } from "react-query";
import Services from '../../../store/ApiService';
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal'
import Button from '../../../compoents/Button';
import {useFlashMessage} from "../../../customHook/useFlashMessage";
import { useNavigate } from 'react-router-dom';
import { removeCookie } from "../../../store/coockie";
import ConfirmPopUp from "../ConfirmPopUp";
import { ConfirmPopupListValue } from "../../../store/types";
import { useTheme } from '../../../customHook/useTheme';

const { AuthService, UserService,SocialService } = Services;

const LogOutConfirm = ()=>{
  const navigate = useNavigate();
  const { closeAllModal,closeModal } = useModal();
  const { isDark } = useTheme();





  const handleSubmit = ()=>{
    closeAllModal()
    removeCookie('refreshToken', { path: '/', secure: true });
    removeCookie('accessToken', { path: '/', secure: true });
    navigate('/')
    }
  

    const handleListAction = (type:string)=>{
      if(type === 'logout'){
        handleSubmit();
      }else{
        closeModal();
      }
    }


  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };

  const ValueOfConfirmPopup: ConfirmPopupListValue[] = [
    { text: '로그아웃하기', type: 'logout' },
    { text: '취소하기', type: 'normal' }
  ];


  return(
   <form onSubmit={handleSubmit}>
    <ConfirmPopUp anchorClick={handleListAction} isDark={isDark} list={ValueOfConfirmPopup} title="정말 로그아웃하시겠어요?" text="로그아웃 후 다시 로그인 해주시기 바랍니다." ></ConfirmPopUp>
   </form> 
)

}
export default LogOutConfirm;