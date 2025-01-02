import MenuList from '../../MenuList';
import {useTheme} from '../../../customHook/useTheme';
import { useState } from 'react';
import ThemeBar from '../../ThemeBar';
const MenuOfMenuBar = ({value}:any)=>{

  const exampleFormat = [
      { type: 'darkMode', value: '다크모드 활성' },
      { type: 'Language setting', value: '언어 설정' },
      { type: 'LogOut', value: '로그아웃' },
  ];
  const [isDarkModeFormat,setIsDarkModeFormat] = useState<boolean>(false);
  const { isDark } = useTheme();

// className={`z-50 w-80 h-80  border ${isDark?'bg-hovercustomBlack':'bg-hovercustomWhite'} ${isDark?'border-customLightGray':'border-customGray'} overflow-hidden rounded-t-2xl rounded absolute`

const handleOnClick = (type:string)=>{
  switch(type){
    case 'darkMode':
      return setIsDarkModeFormat(true);

  }
}
// transition-all duration-300 ease-in-out  
return(
  <div className={`p-4 z-50 bottom-[50px] w-auto h-auto  border ${isDark?'bg-customLightBlack':'bg-customRealWhite'} ${isDark?'border-customLightGray':'border-customGray'} overflow-hidden rounded-2xl  absolute`}>
   {isDarkModeFormat
    ?   
    <ThemeBar></ThemeBar>
    : <MenuList handleOnClick={handleOnClick} menuArray={exampleFormat}></MenuList>
   }


  </div>
)
}

export default MenuOfMenuBar;