import React from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons'; // 아이콘 타입 가져오기
import { useTheme } from "../customHook/useTheme"
import ActiveDot from './ActiveDot';
import { Font_color_Type_1,Font_color_Type_2 } from '../store/ColorAdjustion';
interface IconLinkProps {
  to: string;
  activeicon: IconType; // 아이콘 타입
  disActiveicon: IconType; // 아이콘 타입
  iconSize?:string;
  size?: string; // 기본 크기
  hoverBgColor?: string; // 호버 배경 색상
  scale?: string; // 스케일 값
  isNofiticate: boolean; // 스케일 값
  isActivated:boolean;
  numberOfActive?:number;
  isShowNumber?:boolean;
}

const IconLink: React.FC<IconLinkProps> = ({
  to,
  activeicon:Activeicon,
  disActiveicon:DisActiveicon,
  isActivated,
  isNofiticate = false,
  iconSize = 'text-2xl', // 기본값 설정
  size = 'w-14 h-14',
  hoverBgColor = 'bg-customGray',
  numberOfActive = 0,
  isShowNumber = true

}) => {

  const { isDark } = useTheme();


  return (
    <Link className={`relative ${size} flex items-center justify-center group`} to={to}>
      <div className={`absolute inset-0 rounded-xl bg-transparent  transform scale-100 duration-300 group-hover:scale-110 ${isDark?'group-hover:bg-hovercustomBlack':'group-hover:bg-hoverLightGray'}`} />
      {
          isNofiticate && numberOfActive > 0 ?
          <ActiveDot isShowNumber={isShowNumber} numberOfActive={numberOfActive}></ActiveDot>
          :
          null
        }
     <div className='relative flex items-center justify-center'>
      {isActivated ? (
          <Activeicon className={`${Font_color_Type_1(isDark)} ${iconSize}`} />
        ) : (
          <DisActiveicon className={`${Font_color_Type_2(isDark)} ${iconSize}`} />
        )}
      </div>
    </Link>
  );
};

export default IconLink;
