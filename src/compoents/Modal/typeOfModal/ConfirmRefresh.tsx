import { useMutation,useQueryClient } from "react-query";
import Services from '../../../store/ApiService';
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal'
import Button from '../../../compoents/Button';
import { useTheme } from '../../../customHook/useTheme';
import { MdRefresh } from 'react-icons/md';
import { Font_color_Type_1, Font_color_Type_2, Bg_color_Type_1, Bg_color_Type_3, Border_color_Type } from '../../../store/ColorAdjustion';
import { COLOR } from '../../../store/ThemeColor';
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
    window.location.assign(`/main/@/${value.nickName}`);
  }
 
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };

  return(
   <form onSubmit={handleSubmit}>
    <div
      onClick={handleModalClick}
      className={`flex flex-col gap-5 rounded-2xl border ${Bg_color_Type_3(isDark)} ${Border_color_Type(isDark)} px-6 py-6 shadow-sm`}
    >
      <div className="flex justify-center items-center gap-4">
        <div className={`${Font_color_Type_1(isDark)} text-center`}>
          <p className="mb-3 text-base font-semibold">프로필 업데이트 완료</p>
          <p className={`text-sm ${Font_color_Type_2(isDark)}`}>변경 내용을 적용하려면 새로고침이 필요해요.</p>
        </div>
      </div>
      <div className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${Bg_color_Type_1(isDark)} ${Font_color_Type_2(isDark)}`}>
        <span>이동할 프로필</span>
        <span className={`font-semibold ${accentColorClass}`}>@{value.nickName}</span>
      </div>
      <Button
        type='submit'
        width='100%'
        padding='12px 16px'
        background_color='b-theme'
        color='white'
      >
        새로고침
      </Button>
    </div>
   </form> 
)

}
export default ConfirmRefresh;
