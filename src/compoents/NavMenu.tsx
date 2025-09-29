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
import useMediaQuery from '../customHook/useMediaQuery';
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useTheme } from '../customHook/useTheme';
import { Font_color_Type_2, Bg_color_Type_1, Border_color_Type } from '../store/ColorAdjustion';
import HoverBackground from './HoverEventCompoents/HoverBackground';
import TransitionDiv from './TransitionDiv';
import { COLOR } from '../store/ThemeColor';
import ThemeBar from './ThemeBar';

import useModal from '../customHook/useModal';
const NavMenu = () => {

    const navigate = useNavigate();
    const { updateNavInfo } = useNavInfo();
    const infoNav = useSelector((state:RootState) => state.infoNavSlice);
    const { openModal,closeModal } = useModal()
    const triggerRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery("(max-width: 859px)");
    const { isDark } = useTheme();
    const [showRecommendSlide, setShowRecommendSlide] = useState(false);
    const isMainPage = infoNav.type === 'main';
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

    const handleRecommendClick = () => {
        setShowRecommendSlide(!showRecommendSlide);
    }

    const handleBackdropClick = () => {
        setShowRecommendSlide(false);
    }

    const handleRecommendOptionClick = (type: string) => {
        // 추천 옵션 클릭 시 처리
        console.log('Selected option:', type);
        setShowRecommendSlide(false);


        if(type === 'Recommand'){
            navigate('/main')
        }else if(type === 'FollowingPost'){
            navigate('/main/followingPost')
        }else if(type === 'LikePost'){
            navigate('/main/likedPost')
        }

        
    }

    const handleLogout = () => {
        openModal({
            type: 'logOutConfirm',
            props: {
                isForce: true,
                modal: {
                    isCenterMessage:'알림',
                    width: 'w-68',
                    navButtonOption: {
                        isClose: true
                    }
                }
            }
        });
    }
  



    return (
        <>
            {/* 슬라이드 메뉴 백드롭 */}
            {showRecommendSlide && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-[99998]"
                    onClick={handleBackdropClick}
                ></div>
            )}
            
            {isMobile ? (
                // 모바일 버전
                <div className="relative w-full flex items-center h-16 px-4">
                    {/* 왼쪽: 뒤로가기 버튼 + 제목 */}
                    <div className="flex items-center space-x-3">
                        {infoNav.value&&infoNav.value.isBack? 
                            <CustomClickedButton onClick={backToUrl}>
                                <IoArrowBack className="text-xl"></IoArrowBack>
                            </CustomClickedButton>:null}
                            
                        {!isMainPage ? (
                            <p className="text-lg font-semibold">{infoNav.titleValue}</p>
                        ):
                           (
                        <div className="relative">
                            <div 
                                className={`${Font_color_Type_2(isDark)} cursor-pointer duration-300 ${isDark?'hover:text-hoverLightGray':'hover:text-hovercustomBlack'}`}
                                onClick={handleRecommendClick}
                            >
                                <HiOutlineMenuAlt2 className='text-2xl'></HiOutlineMenuAlt2>
                            </div>
                            
                            {/* 슬라이드 메뉴 */}
                            <div className={`fixed top-0 left-0 h-full w-[80%] ${isDark ? 'bg-customBlack' : 'bg-customWhite'} shadow-2xl z-[99999] transition-all duration-300 ease-in-out transform ${showRecommendSlide ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="p-6 pt-10">
        {/* 상단 제목 및 아이콘 */}
        <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl font-bold ${isDark ? 'text-customWhite' : 'text-customBlack'}`}>{infoNav.titleValue}</h2>
            <div className="flex space-x-4">
                <HoverBackground
                >
                <button onClick={handleRecommendClick} className="text-2xl" aria-label="닫기">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${isDark ? 'text-customWhite' : 'text-customBlack'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </HoverBackground>
            </div>
        </div>
       
        {/* 상단 버튼 그룹 */}
        <div className="flex mb-8 space-x-4">
            <button className={`flex-1 py-3 rounded-full border ${isDark ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center space-x-2`}>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDark ? 'text-customWhite' : 'text-customBlack'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
            <button className={`flex-1 py-3 rounded-full border ${isDark ? 'border-gray-600' : 'border-gray-300'} flex items-center justify-center space-x-2`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isDark ? 'text-customWhite' : 'text-customBlack'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
            </button>
        </div>
         <div className='h-full flex flex-col justify-between'>
             {/* 메뉴 그룹 */}
             <div className="space-y-2">
                 
                 <TransitionDiv isDark={isDark}>
                     <div
                         className={`px-4 py-3 text-lg font-medium ${isDark ? 'text-customWhite hover:bg-gray-700' : 'text-customBlack hover:bg-gray-100'} cursor-pointer transition-colors duration-200 border-l-4 ${infoNav.value?.type === 'Recommand' ? (isDark ? 'border-customborderDarkGray bg-customborderDarkGray/20' : 'border-customborderLightGray bg-customborderLightGray/20') : (isDark ? 'border-transparent' : 'border-transparent')}`}
                         onClick={() => handleRecommendOptionClick('Recommand')}
                     >
                         추천
                     </div>
                 </TransitionDiv>
                 
                 <TransitionDiv isDark={isDark}>
                     <div
                         className={`px-4 py-3 text-lg font-medium ${isDark ? 'text-customWhite hover:bg-gray-700' : 'text-customBlack hover:bg-gray-100'} cursor-pointer transition-colors duration-200 border-l-4 ${infoNav.value?.type === 'FollowingPost' ? (isDark ? 'border-customborderDarkGray bg-customborderDarkGray/20' : 'border-customborderLightGray bg-customborderLightGray/20') : (isDark ? 'border-transparent' : 'border-transparent')}`}
                         onClick={() => handleRecommendOptionClick('FollowingPost')}
                     >
                         팔로잉
                     </div>
                 </TransitionDiv>
                 
                 <TransitionDiv isDark={isDark}>
                     <div
                         className={`px-4 py-3 text-lg font-medium ${isDark ? 'text-customWhite hover:bg-gray-700' : 'text-customBlack hover:bg-gray-100'} cursor-pointer transition-colors duration-200 border-l-4 ${infoNav.value?.type === 'LikePost' ? (isDark ? 'border-customborderDarkGray bg-customborderDarkGray/20' : 'border-customborderLightGray bg-customborderLightGray/20') : (isDark ? 'border-transparent' : 'border-transparent')}`}
                         onClick={() => handleRecommendOptionClick('LikePost')}
                     >
                         좋아요
                     </div>
                 </TransitionDiv>
             </div>
             {/* 유틸 그룹*/}
             <div className={`p-4 ${Bg_color_Type_1(isDark)} ${Border_color_Type(isDark)} border-t`}>
                 <ThemeBar></ThemeBar>
                 <div 
                     className={`w-full p-3 mt-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDark ? 'text-customWhite' : 'text-customBlack'}`}
                     onClick={handleLogout}
                 >
                     로그아웃
                 </div>
             </div>
         </div>
    </div>
</div>
                        </div>
                    )}
                    </div>
                    
                    {/* 가운데: 로고 */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                    {isMainPage && (
                        <img src="/logo3.png" alt="Logo" className="h-8 w-8" />
                    )}
                    </div>

                    {/* 오른쪽: 빈 공간 (균형을 위해) */}
                    <div className="ml-auto"></div>
                 
                </div>
            ) : (
                // 데스크톱 버전 (기존)
                <div className="relative w-full flex justify-between h-auto md:h-24 px-4">
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
                                <p className="text-lg font-semibold">{infoNav.titleValue}</p>
                            </div>
                            {isMainPage && (
                                <HoverMagnifying>
                                    <div ref={triggerRef}>
                                        <PostTool handleOnClick={handleOnClick} isDark={true} typeOfTool={{type:'SpecificPage',value:null}}></PostTool>
                                    </div>
                                </HoverMagnifying>
                            )}
                            <div className='absolute w-full'></div>
                        </div>
                    </div>

                    <div className="ml-6 pr-2 h-full flex items-center">
                        <div className="w-12 h-12 justify-center items-center flex">
                            <div>{infoNav.subTitleValue}</div>
                        </div>
                    </div>
                </div>
            )}
        </>
        )
    }

export default NavMenu