import React, { useEffect } from 'react';
import { useFloating, offset, flip, shift, autoPlacement } from '@floating-ui/react-dom';

interface FloatingWrapperProps {
  referenceElement?: HTMLElement;
  children?: React.ReactNode; // children을 명시적으로 선언
}

const FloatingWrapper: React.FC<FloatingWrapperProps> = ({ referenceElement, children }) => {
  const { x, y, strategy, refs } = useFloating({
    placement: 'right',
    middleware: [offset(8), flip(), shift({ padding: 8 }), autoPlacement()],
  });

  useEffect(() => {
    if (referenceElement) {
      refs.setReference(referenceElement);
      console.log(referenceElement,'referenceElement!')
    }
  }, [referenceElement, refs]);

  return (
    <div
      ref={refs.setFloating}
      style={{
        position: strategy,
        top: y ?? '',
        left: x ?? '',
        zIndex: 9999,
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '10px'
      }}
    >
      {children}
    </div>
  );
};

export default FloatingWrapper;