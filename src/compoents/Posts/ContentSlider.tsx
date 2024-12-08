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

  const slideToShowValue =  contentsValue.length >2 ?2.5:contentsValue.length
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: contentsValue.length,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <Slider className="relative " {...settings}>
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