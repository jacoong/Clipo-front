import useModal from '../../../customHook/useModal';
import { useSelector } from 'react-redux';
import { modalSelector } from '../../../store/modalSlice'

const Menu = ()=>{

  
  const modalState = useSelector(modalSelector);
  


  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };


return(
    <div onClick={handleModalClick} className="bg-slate-600 text-cyan-50 rounded absolute">
    <div onClick={handleModalClick} className="top-5">
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
    </div>
)
}

export default Menu;