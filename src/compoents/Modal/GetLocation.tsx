import React, { useState, useLayoutEffect, useRef,isValidElement,cloneElement } from 'react';
import { AnimatePresence, motion } from 'framer-motion';


const GetLocation: React.FC<any> = ({ potalSpot, children, className }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [positionReady, setPositionReady] = useState(false);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const popupRect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - popupRect.bottom;
    const objectHeight = popupRect.height;
  
    const isEnough = spaceBelow < objectHeight;
    const top = isEnough
      ? potalSpot.top
      : potalSpot.top - objectHeight;
  
    setPosition({
      top,
      left: potalSpot.left + window.scrollX,
    });
    setPositionReady(true);
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
