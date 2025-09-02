import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Skeleton_color_baseColor,Skeleton_color_highlightColor } from '../../store/ColorAdjustion';

const PostItemSkeleton = ({isDark}:{isDark:boolean}) => {
  const [percentages, setPercentages] = useState<string[]>([]);

  function getRandomPercentages() {
    // 첫 번째 숫자: 20% ~ 35% 범위의 무작위 숫자
    const min1 = 20;
    const max1 = 38;


    const percent1 = Math.floor(Math.random() * (max1 - min1 + 1)) + min1;
  
    // 두 번째 숫자: 80% ~ 100% 범위의 무작위 숫자
    const min2 = 70;
    const max2 = 90;
    const percent2 = Math.floor(Math.random() * (max2 - min2 + 1)) + min2;
  
    // 세 번째 숫자: 40% ~ 65% 범위의 무작위 숫자
    const min3 = 38;
    const max3 = 65;
    const percent3 = Math.floor(Math.random() * (max3 - min3 + 1)) + min3;
  
    return setPercentages([`${percent1}%`, `${percent2}%`, `${percent3}%`]);
  }

  useEffect(() => {
    getRandomPercentages();
  }, []);

    return (
      percentages.length > 0 ?
      <div className="py-4 w-full flex relative">
        <div className="flex px-3 py-2 w-full">
          {/* Profile */}
          <div className="">
            <Skeleton highlightColor={`${isDark?'#999999':'#f5f5f5'}`} baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} count={1} circle={true} height={'40px'} width={'40px'} />
          </div>
  
          <div className="mx-3 w-full">
            {/* Header (닉네임 + 메뉴) */}
            <div className="flex w-full relative items-center justify-between">
              <div className='flex w-full flex-col'>
                <Skeleton highlightColor={`${isDark?'#999999':'#f5f5f5'}`} baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} count={1} height={16} width={percentages[0]} />
                <Skeleton highlightColor={`${isDark?'#999999':'#f5f5f5'}`} baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} count={1} height={16} width={percentages[1]} />
                <Skeleton highlightColor={`${isDark?'#999999':'#f5f5f5'}`} baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} count={1} height={16} width={percentages[2]} />
              </div>
            </div>
  
            {/* Content */}
            {/* <div className="my-3">
              <div className="w-full h-10 bg-gray-200 rounded-xl"></div>
            </div> */}
  
            {/* Tools */}
            <div className="flex space-x-9 mt-2">
              <Skeleton highlightColor={`${isDark?'#999999':'#f5f5f5'}`} baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} count={1} height={'20px'} width={'20px'} />
              <Skeleton highlightColor={`${isDark?'#999999':'#f5f5f5'}`} baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} count={1} height={'20px'} width={'20px'} />
              <Skeleton highlightColor={`${isDark?'#999999':'#f5f5f5'}`} baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} count={1} height={'20px'} width={'20px'} />
            </div>
  
          </div>
        </div>
      </div>
      :
      null
    );
  };
  
  export default PostItemSkeleton;
