import NavMenu from "./NavMenu"
import MainBody from "../pages/pageModule/MainBody"
import react, {ReactNode} from 'react'


interface MainBodyProps {
  children: ReactNode; // children을 props의 일부로 정의
}

const MainContainer = ({children}:MainBodyProps) => {
    return (
      <div className="w-full h-full flex flex-col">
      <NavMenu></NavMenu>
      <MainBody>
      {children}
      </MainBody>
      </div>
        )
    }

export default MainContainer