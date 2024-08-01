import { FaHome, FaSearch, FaHeart, FaUser } from 'react-icons/fa';
import { BsPin } from 'react-icons/bs';
import IconLink from './IconLink';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { GoHomeFill } from "react-icons/go";
import { useTheme } from "../customHook/useTheme"

const Menubar = () => {

  const { isDark } = useTheme();

    return (
      <div className="relative z-10 w-20 h-full text-whitze flex flex-col items-center py-4">
      <div className="mb-8 mt-4">
        {/* 로고 이미지 */}
        <img src="https://react-icons.github.io/react-icons/icons?name=FaHome" alt="Logo" className="h-8 w-8" />
      </div>

      <div className='flex flex-col justify-center gap-2 flex-grow '>
      <IconLink to="/" icon={GoHomeFill} iconSize='text-3xl'/>
      <IconLink to="/" icon={FaSearch} />
      <IconLink to="/" icon={FaHeart} />
      <IconLink to="/profile" icon={FaUser} />
      </div>



      <div className="mb-8 space-y-8">
        <div className={`${isDark?'text-customLightGray':'text-customGray'} duration-300 ${isDark?'hover:text-hoverLightGray':'hover:text-hovercustomBlack'}`}>
              <BsPin className={`text-2xl`}></BsPin>
          </div>

          <div className={`${isDark?'text-customLightGray':'text-customGray'} duration-300 ${isDark?'hover:text-hoverLightGray':'hover:text-hovercustomBlack'}`}>
              <HiOutlineMenuAlt2 className='text-2xl'></HiOutlineMenuAlt2>
          </div>
      </div>

    </div>
        )
    }

export default Menubar