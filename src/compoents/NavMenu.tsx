import useNavInfo from '../customHook/useNavInfo';
import { useEffect,useState } from 'react';
import { RootState } from '../store/index';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomClickedButton from './CustomClickedButton';
import { IoArrowBack } from "react-icons/io5";
import Services from '../store/ApiService'


const NavMenu = () => {

    const navigate = useNavigate();
    const { updateNavInfo } = useNavInfo();
    const infoNav = useSelector((state:RootState) => state.infoNavSlice);
 
    // const getUnreadNumber = ()=>{
    //     if(infoNav. ){
    //         if(infoNav.value?.unReadNumber){

    //         }else{
    //             return
    //         }
    //     }
    //     return
    // }


    const backToUrl = () =>{
        navigate(-1)
    }


  



    return (
        <>
            <div className="relative w-full flex justify-between h-24 px-4">
            <div className="ml-2 pr-6 h-full flex items-center">
            <div className="w-12 h-12 justify-center items-center flex">
                {infoNav.value&&infoNav.value.isBack? 
                <CustomClickedButton onClick={backToUrl}>
                    <IoArrowBack></IoArrowBack>
                </CustomClickedButton>:null}
               
            </div>
            </div>

            <div className="relative w-auto h-full flex items-center">
            <div className="p-3 justify-center items-center flex">
            <div>
                {infoNav.titleValue}
            </div>
                {/* <div className='absolute bottom-1'>{infoNav.subTitleValue}</div> */}
            </div>
            </div>


            <div className="ml-6 pr-2 h-full flex items-center">
            <div className="w-12 h-12 justify-center items-center flex">
            <div>{infoNav.subTitleValue}</div>
            </div>
            </div>

            </div>
            {/* <div className='w-full flex justify-between h-5 px-4'>

            </div> */}
        </>
        )
    }

export default NavMenu