import React, { ReactNode } from 'react';

interface ShadowWrapperProps {
  children: ReactNode;
  rounded: string;
}

const ShadowWrapper: React.FC<ShadowWrapperProps> = ({
  children,rounded
}) => (
  <div className={`${rounded} shadow-[rgba(149,_157,_165,_0.2)_0px_8px_12px]`}>
    {children}
  </div>
);

export default ShadowWrapper;