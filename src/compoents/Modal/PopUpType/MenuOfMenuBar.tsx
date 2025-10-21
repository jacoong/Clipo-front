import MenuList, { MenuAction, MenuListItem } from '../../MenuList';
import {useTheme} from '../../../customHook/useTheme';
import { useState,useLayoutEffect,useRef } from 'react';
import ThemeBar from '../../ThemeBar';
import useModal from '../../../customHook/useModal';
import { Border_color_Type,Bg_color_Type_3 } from '../../../store/ColorAdjustion';
const MenuOfMenuBar = ({potalSpot}:any)=>{
  const { openModal } = useModal();
  const {left,top} = potalSpot;
  const exampleFormat: MenuListItem[] = [
      { type: 'darkMode', value: '테마설정' },
      { type: 'Language setting', value: '언어설정(다국어 추가예정)' },
      { type: 'LogOut', value: '로그아웃' },
  ];
  const [isDarkModeFormat,setIsDarkModeFormat] = useState<boolean>(false);
  const { isDark } = useTheme();

// className={`z-50 w-80 h-80  border ${isDark?'bg-hovercustomBlack':'bg-hovercustomWhite'} ${isDark?'border-customLightGray':'border-customGray'} overflow-hidden rounded-t-2xl rounded absolute`
const popupRef = useRef<HTMLDivElement>(null);
const handleOnClick = (type: MenuAction)=>{
  switch(type){
    case 'darkMode':
      return setIsDarkModeFormat(!isDarkModeFormat);
    case 'LogOut':
      openModal({
        type: 'logOutConfirm',
        props: {
          isForce: true,
          modal: {
            isCenterMessage:'알림',
            width: 'w-68',
            navButtonOption: {
              isClose: true
            }
          }
        }
      });
  }
}

const [position, setPosition] = useState<{ top: number; left: number }>({
  top: 0,
  left: 0,
});

useLayoutEffect(() => {
  if (!popupRef.current) return;

  const popupRect = popupRef.current.getBoundingClientRect();
  const spaceBelow = window.innerHeight - potalSpot.bottom;
  const objectHeight = popupRect.height;

  // 아래 공간이 충분하지 않으면 위로 뒤집기
  const isEnough = spaceBelow < popupRect.height 
  
  const top = isEnough
    ? potalSpot.top
    : potalSpot.top - popupRect.height;                 // 버튼 아래에 붙도록
  setPosition({
    top: top,
    left: potalSpot.left + window.scrollX,
  });
}, [potalSpot]);


return(
  <div
  className={`p-3 w-auto h-auto  border ${Bg_color_Type_3(isDark)} ${Border_color_Type(isDark)} overflow-hidden rounded-2xl`}>
   {isDarkModeFormat
    ?   
    <ThemeBar handleOnClick={handleOnClick}></ThemeBar>
    : <MenuList isDark={isDark} handleOnClick={handleOnClick} menuArray={exampleFormat}></MenuList>
   }
  </div>
)
}

export default MenuOfMenuBar;
