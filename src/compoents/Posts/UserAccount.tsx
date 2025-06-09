import { Link } from 'react-router-dom';
import React, { useRef } from 'react';
import useModal from '../../customHook/useModal';

interface typeofUserAccount  {
    username:string;
    idNum:string
}
const UserAccountLink = ({ username,idNum }:typeofUserAccount) => {
  const timeoutRef = useRef<number | null>(null);
  const { openModal,closeModal } = useModal()
  const triggerRef = useRef<HTMLDivElement>(null);


  
  const showUserAccount = (action: string) => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    if (action === 'open') {
      timeoutRef.current = window.setTimeout(() => {
        openModal({
          type: 'Popup',
          props: {
            isPotal: true,
            typeOfPopup: 'accountInfo',
            potalSpot: { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },
            value: {
              username: username,
              locationValue: '480px',
            },
          },
        });
      }, 1000);
    } else if (action === 'close') {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  };

  return (
    <div ref={triggerRef}>
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
