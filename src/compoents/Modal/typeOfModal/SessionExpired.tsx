import { useEffect } from "react";
import Button from '../../Button';
import {useNavigate} from 'react-router-dom';
import {useTheme} from '../../../customHook/useTheme';
import { removeCookie } from "../../../store/coockie";
import useModal from '../../../customHook/useModal'
import { Font_color_Type_1 } from "../../../store/ColorAdjustion";
const SessionExpired = ({value}:any)=>{
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const {closeAllModal,openModal} = useModal();

    const deleteRefreshToken_NavigateToLoginMainPage = ()=>{
        closeAllModal()
        removeCookie('refreshToken', { path: '/', secure: true })
        removeCookie('accessToken', { path: '/', secure: true })
        navigate('/')
    }

return(
    <>
    <div className={`p-1 text-center ${Font_color_Type_1(isDark)}`}>
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