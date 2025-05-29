import { useNavigate, Outlet, Link,useLocation } from 'react-router-dom'; // If yo
import {useContext,useEffect,useState,ReactNode} from 'react';
import useModal from '../customHook/useModal';

function UsernamePage() {
    const navigate = useNavigate();
    const { openModal } = useModal();

    const openUsername = () => {
        openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
      };
      
    useEffect(()=>
    {
    openUsername();
    },[])

    return(
        <></>
    )

}

export default UsernamePage;