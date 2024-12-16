import React, { useState, useEffect } from 'react';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ContentSliderProps {
  isDark: boolean;
  contentsValue: string[]; // Array of image URLs
}

interface ImageData {
  src: string;
  aspectRatio: string; // Aspect ratio in the format "x/y"
}

const ContentSlider = ({ contentsValue, isDark }: ContentSliderProps) => {
  const [imagesData, setImagesData] = useState<ImageData[]>([]);
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
      setImagesData(processedImages);

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

  useEffect(() => {
    console.log('did it!')
    setSliderKey((prev) => prev + 1); // key 값 변경으로 리렌더링
  }, [imagesData]);

  return (

   <Slider key={sliderKey} className="w-full relative " {...settings}>
      {imagesData.map((image, index) => (
        <div
          key={index}
          
        //   className={`bg-white aspect-[${image.aspectRatio}] max-h-[430px]`}
          className={` aspect-[5/4] max-h-[430px]`}
    
          onClick={handlePreventDefault}
        >
          <img
            className={`object-cover rounded-2xl ${contentsValue.length === 1?'w-auto':'w-full'} h-full max-h-[430px]`}
            src={image.src}
            alt={`Image ${index + 1}`}
            // aspect-ratio: 0.4;
          />
        </div>
      ))}
    </Slider>
  
 
  );
};

export default ContentSlider;