import NavMenu from "./NavMenu"
import MainBody from "../pages/pageModule/pageKit/MainBody"
import react, {ReactNode} from 'react'
import ShadowDiv from "../store/ShadowDiv"
import useMediaQuery from '../customHook/useMediaQuery';
interface MainBodyProps {
  children: ReactNode; // children을 props의 일부로 정의
  isDark: boolean;
}

const MainContainer = ({children,isDark}:MainBodyProps) => {
  const isMobile = useMediaQuery("(max-width: 859px)");

  
    return (
      
<div className="h-screen flex flex-col">
    {/* 고정 상단 네비게이션 - 모바일에서는 숨김 */}

      <div className="absolute top-0 left-0 w-full z-20">
        <NavMenu />
      </div>

    {/* 스크롤 가능한 메인 콘텐츠 */}
    <div className="pt-0 md:pt-24 flex-1">
      <ShadowDiv rounded={'rounded-t-2xl'}>
        <MainBody>
          {children}
        </MainBody>
      </ShadowDiv>
    </div>
  </div>
        )
    }

export default MainContainer