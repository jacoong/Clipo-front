import { Link } from 'react-router-dom';
import React, { useRef } from 'react';
import useModal from '../../customHook/useModal';
import { Font_color_Type_1 } from '../../store/ColorAdjustion';

interface typeofUserAccount  {
    username:string;
    isDark:boolean;
    idNum:string
}
const UserAccountLink = ({ username,idNum,isDark }:typeofUserAccount) => {
  const timeoutRef = useRef<number | null>(null);
  const { openModal,closeModal } = useModal()
  const triggerRef = useRef<HTMLDivElement>(null);


  
  const showUserAccount = (action: string) => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    if (action === 'open') {
      timeoutRef.current = window.setTimeout(() => {
        openModal({
          type: 'accountInfo',
          props: {
            isTransParentBackground:true,
            potalSpot: { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },
            value: {
              username: username,
              // locationValue: '480px',
            },
          },
        });
      }, 5000);
    } else if (action === 'close') {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  };

  return (
    <div ref={triggerRef} className={`${Font_color_Type_1(isDark)}`}>
    <Link
      onMouseEnter={() => showUserAccount('open')}
      onMouseLeave={() => showUserAccount('close')}
      onClick={(e) => e.stopPropagation()}
      className="font-bold text-base hover:underline"
      to={`/main/@/${username}`}
    >
      {username}
    </Link>
    </div>
  );
};

export default UserAccountLink;
