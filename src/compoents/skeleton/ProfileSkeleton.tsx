import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Skeleton_color_baseColor,Skeleton_color_highlightColor } from '../../store/ColorAdjustion';

const ProfileSkeleton = ({isDark}:{isDark:boolean}) => {
  const [percentages, setPercentages] = useState<string[]>([]);

  function getRandomPercentages() {
    // 프로필 정보용 퍼센트 생성
    const percent1 = Math.floor(Math.random() * (25 - 15 + 1)) + 15; // 닉네임
    const percent2 = Math.floor(Math.random() * (35 - 20 + 1)) + 20; // 이메일
    const percent3 = Math.floor(Math.random() * (45 - 30 + 1)) + 30; // 설명
    const percent4 = Math.floor(Math.random() * (20 - 10 + 1)) + 10; // 위치
    const percent5 = Math.floor(Math.random() * (15 - 8 + 1)) + 8;  // 생일

    return setPercentages([`${percent1}%`, `${percent2}%`, `${percent3}%`, `${percent4}%`, `${percent5}%`]);
  }

  useEffect(() => {
    getRandomPercentages();
  }, []);

  return (
    percentages.length > 0 ?
    <div className="w-full flex flex-col">  
      {/* 배경 스켈레톤 */}
      <div className="w-full h-[16rem]">
        <Skeleton 
          highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
          baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
          count={1} 
          height={'100%'} 
          width={'100%'} 
        />
      </div>

      <div className="w-[92%] flex mx-auto flex-col">
        <div className="w-full h-[6rem] flex justify-between">
          {/* 프로필 이미지 스켈레톤 */}
          <div className={`w-[9rem] h-[9rem] relative -top-[4.5rem] flex items-center justify-center overflow-hidden border-4 ${isDark?'border-customLightBlack bg-customLightBlack':'border-customRealWhite bg-customRealWhite'} rounded-full`}>
          <Skeleton 
          className='w-full h-full'
          highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
          baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
          count={1} 
          circle={true}
        />
          </div>

          {/* 팔로우 버튼 스켈레톤 */}
          <div className='mt-[1rem]'>
            <Skeleton 
              highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
              baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
              count={1} 
              height={'32px'} 
              width={'80px'} 
            />
          </div>
        </div>

        <div className="relative">
          {/* 닉네임 스켈레톤 */}
          <div className="mb-2">
            <Skeleton 
              highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
              baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
              count={1} 
              height={24} 
              width={percentages[0]} 
            />
          </div>
          
          {/* 이메일 스켈레톤 */}
          <div className="mb-2">
            <Skeleton 
              highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
              baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
              count={1} 
              height={16} 
              width={percentages[1]} 
            />
          </div>
          
          {/* 설명 스켈레톤 */}
          <div className="py-3 mb-2">
            <Skeleton 
              highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
              baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
              count={1} 
              height={16} 
              width={percentages[2]} 
            />
          </div>
          
          {/* 위치/생일 스켈레톤 */}
          <div className="pb-3 flex space-x-4">
            <Skeleton 
              highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
              baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
              count={1} 
              height={14} 
              width={percentages[3]} 
            />
            <Skeleton 
              highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
              baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
              count={1} 
              height={14} 
              width={percentages[4]} 
            />
          </div>

          {/* 팔로워/팔로잉 스켈레톤 */}
          <div className="mr-[15px] flex space-x-6">
            <Skeleton 
              highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
              baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
              count={1} 
              height={16} 
              width={'60px'} 
            />
            <Skeleton 
              highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
              baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
              count={1} 
              height={16} 
              width={'60px'} 
            />
          </div>
        </div>
      </div>

      {/* 탭 스켈레톤 */}
      <div className={`h-[45px] mt-2 w-full flex justify-between border-b-[0.5px] ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
        <Skeleton 
          highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
          baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
          count={1} 
          height={'100%'} 
          width={'33%'} 
        />
        <Skeleton 
          highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
          baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
          count={1} 
          height={'100%'} 
          width={'33%'} 
        />
        <Skeleton 
          highlightColor={`${isDark?'#999999':'#f5f5f5'}`} 
          baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} 
          count={1} 
          height={'100%'} 
          width={'33%'} 
        />
      </div>
    </div>
    :
    null
  );
};

export default ProfileSkeleton;
