import { useMutation,useQueryClient } from "react-query";
import Services from '../../../store/ApiService';
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal'
import Button from '../../../compoents/Button';
import {useFlashMessage} from "../../../customHook/useFlashMessage";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

const { AuthService, UserService,SocialService } = Services;

const ConfirmRefresh = ({value}:any)=>{
    const navigate = useNavigate();



  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
    e.preventDefault();
    navigate('/main')
  }
 
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };

  return(
   <form onSubmit={handleSubmit}>
    <div onClick={handleModalClick}>
    <p className="text-customBlack">
  닉네임 필드가 변경되었으므로<br />새로고침 합니다.
</p>

    </div>
    <Button type='submit' width='100%' padding='5px 10px'>새로고침</Button>
   </form> 
)

}
export default ConfirmRefresh;