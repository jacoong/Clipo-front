import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Skeleton_color_baseColor,Skeleton_color_highlightColor } from '../../store/ColorAdjustion';

const UserItemSkeleton = ({isDark}:{isDark:boolean}) => {


    return (
      <div className="py-7 p-3 w-full flex relative">
        <div className="flex w-full">
          {/* Profile */}

            <Skeleton highlightColor={`${isDark?'#999999':'#f5f5f5'}`} baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} count={1} circle={true} height={'40px'} width={'40px'} />

  

          <div className="px-3 flex w-full relative items-center justify-between">
                <Skeleton highlightColor={`${isDark?'#999999':'#f5f5f5'}`} baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} count={1} height={'20px'} width={'400px'}  />
                <div className='mr-2'>
                <Skeleton highlightColor={`${isDark?'#999999':'#f5f5f5'}`} height={'30px'} width={'30px'} baseColor={`${isDark?'#2D2D2D':'#ebebeb'}`} count={1}/>  
                </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default UserItemSkeleton;
