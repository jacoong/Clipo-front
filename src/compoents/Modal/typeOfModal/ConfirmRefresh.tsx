import { useMutation,useQueryClient } from "react-query";
import Services from '../../../store/ApiService';
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal'
import Button from '../../../compoents/Button';
import { useTheme } from '../../../customHook/useTheme';
import { Font_color_Type_1, Bg_color_Type_3, Border_color_Type } from '../../../store/ColorAdjustion';
import { useNavigate } from 'react-router-dom';


const { AuthService, UserService,SocialService } = Services;

const ConfirmRefresh = ({value}:any)=>{
    const navigate = useNavigate();
const {closeModal,openModal} = useModal();
const { isDark } = useTheme();
const accentColorClass = 'text-themeColor';


  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    console.log(value)
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
    e.preventDefault();
    navigate(`/main/@/${value.nickName}`)
    closeModal();
  }
 
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };

  return(
   <form onSubmit={handleSubmit}>
    <div
      onClick={handleModalClick}
      className={`flex flex-col gap-4 rounded-2xl border ${Bg_color_Type_3(isDark)} ${Border_color_Type(isDark)} px-5 py-6`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 text-2xl text-themeColor">⟳</span>
        <div className={`${Font_color_Type_1(isDark)} leading-6`}>
          <p className="font-semibold text-base">프로필이 업데이트됐어요.</p>
          <p className="text-sm opacity-80">
            변경된 정보를 적용하려면 새로고침이 필요합니다.<br />
            확인을 누르면 <span className={accentColorClass}>@{value.nickName}</span> 페이지로 이동할게요.
          </p>
        </div>
      </div>
      <Button type='submit' width='100%' padding='10px 14px' background_color={'theme'}>새로고침</Button>
    </div>
   </form> 
)

}
export default ConfirmRefresh;
