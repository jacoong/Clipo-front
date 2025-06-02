import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import {useTheme} from '../../../customHook/useTheme';




function SearchMenu() {

  const { isDark } = useTheme();

  return (
    <div className={`w-full h-auto  `}>
      <Outlet/>
    </div>
          );
  }
    
export default SearchMenu;

