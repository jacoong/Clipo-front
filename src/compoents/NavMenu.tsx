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
import { Font_color_Type_2, Bg_color_Type_1, Border_color_Type,Font_color_Type_1 } from '../store/ColorAdjustion';
import HoverBackground from './HoverEventCompoents/HoverBackground';
import TransitionDiv from './TransitionDiv';
import { COLOR } from '../store/ThemeColor';
import ThemeBar from './ThemeBar';
import useModal from '../customHook/useModal';
import Button from './Button';
const NavMenu = () => {

    const navigate = useNavigate();
    const { updateNavInfo } = useNavInfo();
    const infoNav = useSelector((state:RootState) => state.infoNavSlice);
    const { openModal,closeModal } = useModal()
    const triggerRef = useRef<HTMLDivElement>(null);
    const isMobile = useMediaQuery("(max-width: 768px)");
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
        console.log(navValue,type)
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
            {value:'추천',type:'Recommand',isSelected:isCurrentOption('Recommand')},{value:'팔로잉',type:'FollowingPost',isSelected:isCurrentOption('FollowingPost')},{value:'좋아요',type:'LikePost',isSelected:isCurrentOption('LikePost')},{value:'저장된 피드',type:'SavedPost',isSelected:isCurrentOption('SavedPost')}
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
        else if(type === 'SavedPost'){
            navigate('/main/saved')
        }

        
    }

    const handleLogout = () => {
        setShowRecommendSlide(false);
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
                    className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
                    onClick={handleBackdropClick}
                ></div>
            )}
            
            {isMobile ? (
                // 모바일 버전
                <div className={`absolute ${Bg_color_Type_1(isDark)} w-full flex items-center h-full px-4`}>
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
                            <div
                              className={`fixed top-0 left-0 h-full w-[80%] max-w-xs border-r ${
                                isDark
                                  ? 'bg-gradient-to-b from-[#0f1015] via-[#0b0c10] to-[#060708] border-customborderDarkGray'
                                  : 'bg-gradient-to-b from-white via-[#f8f8fb] to-[#f5f6ff] border-customborderLightGray'
                              } z-[110] shadow-2xl transition-transform duration-300 ease-in-out transform ${
                                showRecommendSlide ? 'translate-x-0' : '-translate-x-full'
                              }`}
                            >
                              <div className="relative flex h-full flex-col overflow-hidden">
                                <div
                                  className={`pointer-events-none absolute -top-24 right-[-60px] h-56 w-56 rounded-full blur-[88px] ${
                                    isDark ? 'bg-themeColor/40' : 'bg-themeColor/30'
                                  }`}
                                ></div>
                                <div
                                  className={`pointer-events-none absolute bottom-[-80px] left-[-40px] h-48 w-48 rounded-full blur-[90px] ${
                                    isDark ? 'bg-[#407bff33]' : 'bg-[#8aa7ff30]'
                                  }`}
                                ></div>
                                {/* 상단 제목 및 아이콘 */}
                                <div
                                  className={`relative flex items-center justify-between px-6 pt-12 pb-6 ${
                                    isDark ? 'bg-white/5' : 'bg-white/60'
                                  } backdrop-blur-sm`}
                                >
                                  <div>
                                    <h2 className={`text-xl font-semibold ${Font_color_Type_1(isDark)}`}>
                                      {infoNav.titleValue}
                                    </h2>
                                    <p
                                      className={`mt-1 text-xs font-medium tracking-wide ${
                                        isDark ? 'text-slate-400' : 'text-slate-500'
                                      }`}
                                    >
                                      원하는 피드를 빠르게 전환해보세요
                                    </p>
                                  </div>
                                  <HoverBackground>
                                    <button onClick={handleRecommendClick} className={`rounded-full p-2 ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`} aria-label="닫기">
                                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${Font_color_Type_1(isDark)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </HoverBackground>
                                </div>
                                <div className="flex-1 overflow-y-auto px-2">
                                  <nav className="space-y-3 py-6">
                                    {[
                                      { label: '추천', key: 'Recommand' as const },
                                      { label: '팔로잉', key: 'FollowingPost' as const },
                                      { label: '좋아요', key: 'LikePost' as const },
                                      { label: '저장된 피드', key: 'SavedPost' as const },
                                    ].map(({ label, key }) => {
                                      const isActive = infoNav.value?.type === key;
                                      const activeStyles = isDark
                                        ? 'bg-gradient-to-r from-themeColor/90 to-themeColor/60 text-white shadow-lg border-transparent'
                                        : 'bg-gradient-to-r from-themeColor to-themeColor/70 text-white shadow-md border-transparent';
                                      return (
                                        <TransitionDiv key={key} isDark={isDark}>
                                          <button
                                            type="button"
                                            onClick={() => handleRecommendOptionClick(key)}
                                            className={`group w-full overflow-hidden rounded-2xl border px-4 py-4 text-left text-base font-semibold transition-all duration-300 ${
                                              isDark
                                                ? 'border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10'
                                                : 'border-[#e2e5f4] bg-white/90 text-slate-800 hover:border-themeColor/40 hover:bg-white'
                                            } ${isActive ? activeStyles : ''}`}
                                          >
                                            <div className="flex items-center gap-3">
                                              <span
                                                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-transform duration-300 ${
                                                  isActive
                                                    ? 'border-white/40 bg-white/20 group-hover:scale-105'
                                                    : isDark
                                                    ? 'border-white/10 bg-white/5 text-slate-300'
                                                    : 'border-[#d7daf0] bg-[#eef0ff] text-slate-700'
                                                }`}
                                              >
                                                {label.charAt(0)}
                                              </span>
                                              <div className="flex flex-col">
                                                <span>{label}</span>
                                                <span
                                                  className={`text-xs font-medium ${
                                                    isActive
                                                      ? 'text-white/80'
                                                      : isDark
                                                      ? 'text-slate-400'
                                                      : 'text-slate-500'
                                                  }`}
                                                >
                                                  {key === 'Recommand'
                                                    ? '오늘의 인기 스레드를 확인해요'
                                                    : key === 'FollowingPost'
                                                    ? '팔로잉한 사람들의 최신 글'
                                                    : '내가 좋아요한 스레드를 모아보기'}
                                                </span>
                                              </div>
                                            </div>
                                          </button>
                                        </TransitionDiv>
                                      );
                                    })}
                                  </nav>
                                </div>
                                <div
                                  className={`relative px-6 pb-10 pt-6 ${
                                    isDark ? 'bg-white/5' : 'bg-white/60'
                                  } border-t ${Border_color_Type(isDark)} backdrop-blur-sm`}
                                >
                                  <div className="space-y-5">
                                    <section
                                      className={`rounded-3xl border px-5 py-4 shadow-sm transition ${
                                        isDark
                                          ? 'border-white/10 bg-white/5'
                                          : 'border-[#dfe2f4] bg-white'
                                      }`}
                                    >
                                      <header className="mb-3">
                                        <p
                                          className={`text-sm font-semibold tracking-wide ${
                                            isDark ? 'text-slate-200' : 'text-slate-700'
                                          }`}
                                        >
                                          Theme 설정
                                        </p>
                                      </header>
                                      <ThemeBar />
                                    </section>

                                   
                                      <Button
                                        type="button"
                                        padding="12px"
                                        width="large"
                                        margin="16px 0 0 0"
                                        background_color={isDark ? 'b-logout-dark' : 'b-logout-light'}
                                        color={isDark ? COLOR.themeColor : COLOR.customRealWhite}
                                        handleClick={handleLogout}
                                      >
                                        <div className="flex items-center justify-center gap-2">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line x1="21" y1="12" x2="9" y2="12"></line>
                                          </svg>
                                          <span className="text-sm font-semibold">로그아웃</span>
                                        </div>
                                      </Button>

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
                <div className="relative w-full flex justify-between h-full">
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
