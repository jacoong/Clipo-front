import React, { useState, useLayoutEffect, useRef,isValidElement,cloneElement } from 'react';
import { AnimatePresence, motion } from 'framer-motion';


const GetLocation: React.FC<any> = ({ potalSpot, children, className }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    
    const popupRect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - popupRect.bottom;
    console.log(spaceBelow,popupRect)
    const objectHeight = popupRect.height;
  
    // 아래 공간이 충분하지 않으면 위로 뒤집기
    const isEnough = spaceBelow < popupRect.height 
    
    const top = isEnough
      ? potalSpot.top 
      : potalSpot.top - popupRect.height;                 // 버튼 아래에 붙도록
    console.log(isEnough,potalSpot,popupRect)
    setPosition({
      top: top,
      left: potalSpot.left + window.scrollX,
    });
  }, [potalSpot]);

  

            
  return (
    <AnimatePresence>
     <motion.div
        ref={wrapperRef}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.1 }}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          zIndex: 1000,
          transformOrigin: '0 0',      // 좌상단을 기준점으로
        }}
        className={className}
      >
      {children}
    </motion.div>
    </AnimatePresence>
  );
}


export default GetLocation;
