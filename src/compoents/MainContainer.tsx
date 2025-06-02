import NavMenu from "./NavMenu"
import MainBody from "../pages/pageModule/pageKit/MainBody"
import react, {ReactNode} from 'react'


interface MainBodyProps {
  children: ReactNode; // children을 props의 일부로 정의
  isDark: boolean;
}

const MainContainer = ({children,isDark}:MainBodyProps) => {
  

  
    return (
      
<div className="h-screen flex flex-col overflow-hidden">
    {/* 고정 상단 네비게이션 */}
    <div className="absolute top-0 left-0 w-full z-50">
      <NavMenu />
    </div>

    {/* 스크롤 가능한 메인 콘텐츠 */}
    <div className="pt-24 flex-1">
    <MainBody>
      {children}
    </MainBody>
    </div>
  </div>
        )
    }

export default MainContainer