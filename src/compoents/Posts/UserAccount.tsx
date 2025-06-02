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


  
  const showUserAccount = (action: string) => {
    console.log('worked')
    if (action === 'open') {
      timeoutRef.current = window.setTimeout(() => {
        openModal({
          type: 'Popup',
          props: {
            isPotal: true,
            typeOfPopup: 'accountInfo',
            potalSpot: `accountInfo${idNum}`,
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
    <Link
      onMouseEnter={() => showUserAccount('open')}
      onClick={(e) => e.stopPropagation()}
      className="font-bold text-base hover:underline"
      to={`/main/@/${username}`}
    >
      {username}
    </Link>
  );
};

export default UserAccountLink;
