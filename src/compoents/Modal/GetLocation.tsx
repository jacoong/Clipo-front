import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const GetLocation: React.FC<any> = ({ potalSpot, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isReadyToShow, setIsReadyToShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    setIsVisible(true);
  }, []);

  // 위치 계산 함수
  const calculatePosition = () => {
    if (!contentRef.current) return;
    const popupRect = contentRef.current.getBoundingClientRect();
    console.log(popupRect,potalSpot);
    if (popupRect.width === 0 || popupRect.height === 0) {
      return false;
    }
    const spaceBelow = window.innerHeight - potalSpot.top;
    const objectHeight = popupRect.height;
    let top = potalSpot.top;
    if (spaceBelow > objectHeight) {
      top = potalSpot.top;
    } else {
      top = potalSpot.top - objectHeight;
    }
    setPosition({
      top,
      left: potalSpot.left + window.scrollX,
    });
    return true;
  };

  useEffect(() => {
    if (!isVisible || !contentRef.current) return;
    
    // 먼저 크기를 측정하기 위해 애니메이션 없이 렌더링
    const measureSize = () => {
      const rect = contentRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) {
        calculatePosition();
        setIsReadyToShow(true);
        return true;
      }
      return false;
    };

    // ResizeObserver로 크기 변화 감지
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          if (measureSize()) {
            resizeObserver.disconnect();
            break;
          }
        }
      }
    });
    
    resizeObserver.observe(contentRef.current);
    
    // 혹시 모를 첫 렌더링에서 이미 사이즈가 잡혀있는 경우 대비
    setTimeout(() => {
      if (!isReadyToShow && measureSize()) {
        resizeObserver.disconnect();
      }
    }, 30);

    return () => resizeObserver.disconnect();
  }, [isVisible, potalSpot, children]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isReadyToShow ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 1000,
            transformOrigin: '0 0',
          }}
        >
          <div ref={contentRef}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GetLocation;