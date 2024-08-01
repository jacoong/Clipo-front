import NavMenu from "./NavMenu"
import MainBody from "../pages/pageModule/MainBody"

const MainContainer = () => {
    return (
      <div className="w-full h-full flex flex-col">
      <NavMenu></NavMenu>
      <MainBody></MainBody>
      </div>
        )
    }

export default MainContainer