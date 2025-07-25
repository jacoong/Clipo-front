import useNavInfo from '../customHook/useNavInfo';
import { useEffect,useState,useRef } from 'react';
import { RootState } from '../store/index';
import {useSelector} from 'react-redux';
import { useNavigate,useParams } from 'react-router-dom';
import CustomClickedButton from './CustomClickedButton';
import { IoArrowBack } from "react-icons/io5";
import Services from '../store/ApiService'
import HoverMagnifying from '../compoents/HoverEventCompoents/HoverMagnifying';
import PostTool from '../compoents/Posts/PostTool';


import useModal
 from '../customHook/useModal';
const NavMenu = () => {

    const navigate = useNavigate();
    const { updateNavInfo } = useNavInfo();
    const infoNav = useSelector((state:RootState) => state.infoNavSlice);
    const { openModal,closeModal } = useModal()
    const triggerRef = useRef<HTMLDivElement>(null);
    // const getUnreadNumber = ()=>{
    //     if(infoNav. ){
    //         if(infoNav.value?.unReadNumber){

    //         }else{
    //             return
    //         }
    //     }
    //     return
    // }


    const isCurrentOption = (type:string)=>{
        const navValue = infoNav.value.type;
        console.log(infoNav,type)
        if(type === navValue){
            return 'checked'
        }else{
            return
        }
    }

    const backToUrl = () =>{
        navigate(-1)
    }



    const handleOnClick =()=>{
        if (!triggerRef.current) return;
            const NavMenuForMat = [
            {value:'추천',type:'Recommand',isSelected:isCurrentOption('Recommand')},{value:'팔로잉',type:'FollowingPost',isSelected:isCurrentOption('FollowingPost')},{value:'좋아요',type:'LikePost',isSelected:isCurrentOption('LikePost')}
          ];
          const rect = triggerRef.current.getBoundingClientRect();
          openModal({ type:'navbarMenu', props: {isTransParentBackground:true, potalSpot:{ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX },value:{ format:NavMenuForMat} }});
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
            <div className='w-auto3'>
                <p>{infoNav.titleValue}</p>
                
            </div>
            {
            infoNav.type === 'main'?
            <HoverMagnifying>
            <div ref={triggerRef}>
            <PostTool handleOnClick={handleOnClick} isDark={true} typeOfTool={{type:'SpecificPage',value:null}}></PostTool>
            </div>
            </HoverMagnifying>:null
                }
                <div className='absolute w-full'></div>
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