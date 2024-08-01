import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { instance } from '../store/axios_context'
import { BiSolidHomeCircle } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
import ModalCompoent from '../compoents/Modal/ModalCompoent';
import style from './pageCss/MainPage.module.css'
import Menubar from '../compoents/Menubar';
import MainContainer from '../compoents/MainContainer';
// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }


const menuItems = [
  { name: "Home", icon: <BiSolidHomeCircle />, link: "/" },
  { name: "Explore", icon: <AiOutlineUser />, link: "/explore" },
  { name: "Notifications", icon: <AiOutlineUser />, link: "/notifications" },
  { name: "Messages", icon: <AiOutlineUser />, link: "/messages" },
  { name: "Lists", icon: <AiOutlineUser />, link: "/lists" },
  { name: "Communities", icon: <AiOutlineUser />, link: "/communities" },
  { name: "Verified", icon: <AiOutlineUser />, link: "/verified" },
  { name: "More", icon: <AiOutlineUser />, link: "/more" },
];


function MainPage() {
        const navigate = useNavigate();
        const [loading, setLoading] = useState(false);
        // const [userInfo,setUserInfo] = useState<UserType>()
        const [logOutPopUp,setLogOutPopUp] = useState<boolean>(false)

        const savedData:any = localStorage.getItem('userDataKey'); 
        const userId = JSON.parse(savedData);


        // const checkUserName =async () =>{
        //   try {
        //     const res = await axios.get(`https://firstdatebhyunwu-3f2a47c92258.herokuapp.com/user/main/${userId}` ,{ withCredentials: true });
        //     if(res.status === 201){
        //       const userInfo = res.data.userInfo;
        //       if(userInfo.username === null){
        //         todoCtx.sendFlexbox({isOpen:true,type:'shouldUsername'})
        //         setLoading(false);
        //       }else{
        //         setLoading(false);
        //         localStorage.setItem('userDataKey', JSON.stringify(userInfo._id));
        //         return setUserInfo(userInfo)
        //       }
        //     }
        //   }
        //   catch(err:any){
        //     console.error(err)
        //   }
        // }

          
        // const axiosPost = async () => {
        //   // const userId = todoCtx.userInfo._id;
        //   console.log('eeee',userId);
        //   try {
        //     const res = await axios.get('https://firstdatebhyunwu-3f2a47c92258.herokuapp.com/isLogin', { withCredentials: true });
        //     if (res.status === 201) {
        //         localStorage.removeItem('userDataKey');
        //        navigate(res.data.redirect);
        //   } else if (res.status === 200) {
        //       if (userId) {
        //         todoCtx.callApi(0);
              
        //       }
        //     }
        //   }catch (err: any) {
        //     console.error(err);
        //    } 
        //  }
         
         const logOutpopup = (e:React.MouseEvent) =>{
          e.preventDefault();
          console.log('11');
         }

  



    return(

      <>
          {/* <ModalCompoent></ModalCompoent> */}
          <div className='w-full h-screen relative flex box-border'>
                  <Menubar></Menubar>

              <div className='absolute w-full'>
                  <div className='w-full h-lvh sm:w-116 mx-auto'>
                          <MainContainer></MainContainer>
                  </div>
              </div>

  

          </div>
      </>


          
    )
  }
    
export default MainPage;