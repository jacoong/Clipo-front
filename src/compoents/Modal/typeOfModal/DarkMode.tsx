import useModal from '../../../customHook/useModal';
import { useSelector } from 'react-redux';
import { modalSelector } from '../../../store/modalSlice'

const DarkMode = ()=>{

  
  const modalState = useSelector(modalSelector);
  
  // props를 콘솔에 출력 (선택사항)
  console.log("Modal Props:", modalState);

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };


return(
    <div onClick={handleModalClick} className="bg-slate-600 text-cyan-50 rounded absolute">
        <h2>Hello</h2>
    <button>close</button>
    <div>I am a modal2</div>
    <form>
      <input />
      <button>tab navigation</button>
      <button>stays</button>
      <button>inside</button>
      <button>the modal</button>
    </form>
    </div>
)
}

export default DarkMode;