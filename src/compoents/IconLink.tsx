import React from 'react';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons'; // 아이콘 타입 가져오기
import { useTheme } from "../customHook/useTheme"

interface IconLinkProps {
  to: string;
  icon: IconType; // 아이콘 타입
  iconSize?:string;
  size?: string; // 기본 크기
  hoverBgColor?: string; // 호버 배경 색상
  scale?: string; // 스케일 값
}

const IconLink: React.FC<IconLinkProps> = ({
  to,
  icon: Icon,
  iconSize = 'text-2xl', // 기본값 설정
  size = 'w-14 h-14',
  hoverBgColor = 'bg-customGray',
  scale = 'scale-110',
}) => {

  const { isDark } = useTheme();

  return (
    <Link className={`relative ${size} flex items-center justify-center group`} to={to}>
      <div className={`absolute inset-0 rounded-xl bg-transparent  transform scale-100 duration-300 group-hover:scale-110 ${isDark?'group-hover:bg-hovercustomBlack':'group-hover:bg-hoverLightGray'}`} />
      <div className='relative flex items-center justify-center'>
        <Icon className={`${isDark?'text-customLightGray':'text-customGray'} ${iconSize}`} />
      </div>
    </Link>
  );
};

export default IconLink;
