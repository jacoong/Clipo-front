import { useMutation,useQueryClient } from "react-query";
import Services from '../../../store/ApiService';
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal'
import Button from '../../../compoents/Button';
import {useFlashMessage} from "../../../customHook/useFlashMessage";
import { useNavigate } from 'react-router-dom';
import { removeCookie } from "../../../store/coockie";

const { AuthService, UserService,SocialService } = Services;

const LogOutConfirm = ()=>{
  const navigate = useNavigate();





  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
    e.preventDefault();
    removeCookie('refreshToken');
    removeCookie('accessToken');
    navigate('/')
    }
  


  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };

  return(
   <form onSubmit={handleSubmit}>
    <div onClick={handleModalClick}>
        <p className="text-customRed">로그아웃 합니다.</p>
    </div>
    <Button type='submit' width='100%' padding='5px 10px'>확인</Button>
   </form> 
)

}
export default LogOutConfirm;