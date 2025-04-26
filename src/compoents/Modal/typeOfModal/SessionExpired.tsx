import { useEffect } from "react";
import Button from '../../Button';
import {useNavigate} from 'react-router-dom';
import {useTheme} from '../../../customHook/useTheme';
import { removeCookie } from "../../../store/coockie";
import useModal from '../../../customHook/useModal'

const SessionExpired = ({value}:any)=>{
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const {closeModal,openModal} = useModal();

    const deleteRefreshToken_NavigateToLoginMainPage = ()=>{
        closeModal()
        removeCookie('refreshToken')
        removeCookie('accessToken')
        navigate('/')
    }

return(
    <>
    <div className="p-1 text-center">
         <p>세션이 만료되었습니다.<br />
         다시 로그인 해주시기 바랍니다.
         </p>
     </div>
     <div className="w-3/5 mx-auto mt-5">
     <Button handleClick={deleteRefreshToken_NavigateToLoginMainPage} type='submit' width='100%' padding='4px 8px'>확인</Button>
     </div>
     
    </>
 )
 
 }
 export default SessionExpired;