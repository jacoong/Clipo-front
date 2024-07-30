import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { instance } from '../store/axios_context'
import { BiSolidHomeCircle } from "react-icons/bi";
import { AiOutlineUser } from "react-icons/ai";
import { BiSolidUser } from "react-icons/bi";
// import LoadingPage from '../pages/LoadingPage';
import style from './pageCss/MainPage.module.css'
// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }



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

  

        //  useEffect(()=>{
        //   checkUserName();
        //  },[])


    return(
  

                  <div className={`${style.main_body}`}>
                      <div className={style.main_body__banner}>

 

                      <div className={style.main_body__banner__items}>
                
                        
                      <div className={style.main_body__banner__items__logo}>
                          <Link className={style.main_body__banner__items__logo__container} to={`/`}>
                          <img src={process.env.PUBLIC_URL + '/img/Logo.png'}></img>
                        </Link>
                      </div>

                      <div className={style.main_body__banner__items__group}>

                      <div className={style.main_body__banner__items__group__containers}>

                          <Link className={style.main_body__banner__items__item} to={`/`}>
                          <div className={style.main_body__banner__items__item__onClick}>
                          <div className={style.main_body__banner__items__item__onClick__container}>
                          <BiSolidHomeCircle/>
                            <p>Home</p>
                          </div>

                          </div>
                        </Link>

                          <div className={style.main_body__banner__items__item}>
                            <div className={style.main_body__banner__items__item__onClick}>
                            <div className={style.main_body__banner__items__item__onClick__container}>
                              {/* <BiSolidUser/> */}
                              <AiOutlineUser/>
                              <p>Explore</p>
                              </div>
                            </div>
                          </div>

                          <div className={style.main_body__banner__items__item}>
                            <div className={style.main_body__banner__items__item__onClick}>
                            <div className={style.main_body__banner__items__item__onClick__container}>
                              {/* <BiSolidUser/> */}
                              <AiOutlineUser/>
                              <p>Notifications</p>
                              </div>
                            </div>
                          </div>

                          <div className={style.main_body__banner__items__item}>
                            <div className={style.main_body__banner__items__item__onClick}>
                            <div className={style.main_body__banner__items__item__onClick__container}>
                              {/* <BiSolidUser/> */}
                              <AiOutlineUser/>
                              <p>Messages</p>
                              </div>
                            </div>
                          </div>

                          <div className={style.main_body__banner__items__item}>
                            <div className={style.main_body__banner__items__item__onClick}>
                            <div className={style.main_body__banner__items__item__onClick__container}>
                              {/* <BiSolidUser/> */}
                              <AiOutlineUser/>
                              <p>Lists</p>
                              </div>
                            </div>
                          </div>

                          <div className={style.main_body__banner__items__item}>
                            <div className={style.main_body__banner__items__item__onClick}>
                            <div className={style.main_body__banner__items__item__onClick__container}>
                              {/* <BiSolidUser/> */}
                              <AiOutlineUser/>
                              <p>Communities</p>
                              </div>
                            </div>
                          </div>

                          <div className={style.main_body__banner__items__item}>
                            <div className={style.main_body__banner__items__item__onClick}>
                            <div className={style.main_body__banner__items__item__onClick__container}>
                              {/* <BiSolidUser/> */}
                              <AiOutlineUser/>
                              <p>Verified</p>
                              </div>
                            </div>
                          </div>

                          <div className={style.main_body__banner__items__item}>
                            <div className={style.main_body__banner__items__item__onClick}>
                            <div className={style.main_body__banner__items__item__onClick__container}>
                              {/* <BiSolidUser/> */}
                              <AiOutlineUser/>
                              <p>More</p>
                              </div>
                            </div>
                          </div>

                          <div className={`${style.main_body__banner__items__item} ${style.post}`}>
                            <div className={style.main_body__banner__items__Post__onClick}>
                            <div className={style.main_body__banner__items__item__onClick__container}>
                              {/* <BiSolidUser/> */}
                              <p>Post</p>
                              </div>
                            </div>
                          </div>

                      </div>


                      <div className={style.main_body__banner__logOut} onClick={logOutpopup}>

                              {/* <div className={`${style.main_body__banner__items__item} ${style.userLogin}`}> */}
                                  <div className={`${style.main_body__banner__items__item__onClick} ${style.userLogin}`}>
                                  <div className={style.main_body__banner__items__item__onClick__container}>
                                  {/* {userInfo
                                  ?
                                  <UserFileItem profileImg={userInfo?.profileImg} username={userInfo?.username} mail={userInfo?.email} isAuthenticated={userInfo?.isAuthenticated}></UserFileItem>
                                  :
                                  null
                                  }         */}
                                  {/* <div className={style.main_body__banner__items__item__onClick__container_user}>
                                    <p>@dgr</p>
                                    <p>@fescgwefdc</p>
                                  </div> */}
  
                              {/* </div> */}
                          </div>
                
                        

                        </div>

                          </div>



                  </div>



                        


                      </div>

                      {logOutPopUp
                          ?
                          <div className={`${style.main_body__banner__popup}`}>
                            <div className={`${style.main_body__banner__popup__container__LogOut}`}>
                            <div className={`${style.main_body__banner__popup__container__LogOut__item}`}>
                                {/* <Link to={`/${userInfo?.username}`} onClick={goToPage} > Go to My Page {userInfo?.username}</Link> */}
                            </div>
                            <div className={`${style.main_body__banner__popup__container__LogOut__item}`} >
                                <p>Log Out</p>
                            </div>
                            </div>
                          </div>
                          :
                          null
                          }

                      </div>

                      <div className={style.main_body__main}>

                        <div className={style.main_body__main_flashMessage}>
                        {/* <FlashMessage/> */}
                        </div>
                    
                      <Outlet/>

                      <div className={style.main_body__main__side}>
                      <div className={style.main_body__main__side__example}>

                      </div>
                      </div>

                      </div>

                  </div>
    )
  }
    
export default MainPage;