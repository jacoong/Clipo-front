import React, { useState, useEffect,useMemo } from 'react';
import Slider from "react-slick";
import ClosedButton from '../Modal/ClosedButton';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoCloseOutline } from "react-icons/io5";
interface ContentSliderProps {
  isDark: boolean;
  contentsValue: string[]; // Array of image URLs
  isEditable?:boolean;
  sendDeleteList?:(index:number,imageSrc:string)=>void;
}

interface ImageData {
  src: string;
  aspectRatio: string; // Aspect ratio in the format "x/y"
}

const ContentSlider = ({ contentsValue,sendDeleteList, isDark,isEditable=false }: ContentSliderProps) => {
  const [imagesData, setImagesData] = useState<ImageData[]|undefined>(undefined);
  const [sliderKey, setSliderKey] = useState(0); // 슬라이더 강제 리렌더링 키
  useEffect(() => {
    
    const calculateAspectRatios = async () => {
  
      const processedImages = await Promise.all(
        contentsValue.map((src) =>
          new Promise<ImageData>((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              const aspectRatio = `${img.width}/${img.height}`;
              resolve({ src, aspectRatio });
            };
            img.onerror = () => {
              console.error(`Failed to load image: ${src}`);
              resolve({ src, aspectRatio: "1/1" }); // Fallback ratio
            };
          })
        )
        
      );
      console.log(processedImages,'processedImages')
      if(processedImages.length === 0){
        return
      }else{
        setImagesData(processedImages);
      }
    };

    calculateAspectRatios();
  }, [contentsValue]);

  const handlePreventDefault = (event: React.MouseEvent<HTMLDivElement>)=>{
    event.preventDefault(); // 기본 동작 방지
    event.stopPropagation(); // 이벤트 버블링 방지
  }

  const slideToShowValue =  contentsValue.length >2 ? contentsValue.length >3?2.5:3 :contentsValue.length
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow:slideToShowValue,
    slidesToScroll: 1,  
  };

  useMemo(() => {
    setSliderKey((prev) => prev + 1); // key 값 변경으로 리렌더링
  }, [imagesData]);

  return (
    imagesData?
   <Slider key={sliderKey} className="w-full max-w-[640px] relative " {...settings}>
      {imagesData.map((image, index) => (

        <div
          key={index}
          
        //   className={`bg-white aspect-[${image.aspectRatio}] max-h-[430px]`}
          className={` aspect-[5/4] max-h-[430px] relative`}
    
          onClick={handlePreventDefault}
        >
          {isEditable?
                 <div className='w-full flex justify-end absolute'>
                 <div className='min-h-4 flex items-center' onClick={()=>sendDeleteList?.(index,image.src)}>
                     <div className={`cursor-pointer bg-customWhite rounded-full w-4 h-4 flex items-center justify-center transition ease-in-out duration-200 hover:bg-customBlue`} >
                     <IoCloseOutline className={` ${isDark ? 'text-customBlack hover:text-customWhite' : 'text-customWhite hover:text-customBlack'}`}></IoCloseOutline>
                     </div>
                     </div> 
                 </div>
          :
          null
          }
          
              <img
                className={` p-1 object-cover rounded-2xl ${contentsValue.length === 1?'w-full':'w-full'} h-full max-h-[430px]`}
                src={image.src}
                alt={`Image ${index + 1}`}
                // aspect-ratio: 0.4;
              />

        </div>
      ))}
    </Slider>
    :null
  );
};

export default ContentSlider;