// import StateTitle from '../pages/StateTitle'
// import NewTodos from '../NewTodos'
// import Todos from '../Todos'
// import style from '../pages/css/Main.module.css'
// import Loading from '../compoentItem/Loading'
import {useContext,useEffect,useState} from 'react';
// import {TodosContext,UserType} from '../../store/todo_context'
import axios from 'axios'



function MainPage() {
    // const todoCtx = useContext(TodosContext);
    // const savedData:any = localStorage.getItem('userDataKey'); 
    // const userId = JSON.parse(savedData);

    // const [userInfo,setUserInfo] = useState<UserType>()
    // const [isloading,setIsloading] = useState<boolean>(true)

    // const [skip, setSkip] = useState<number>(0)

    //     const getUserInfo = async(userId:string) =>{
    //       try {
    //         const res = await axios.get(`https://firstdatebhyunwu-3f2a47c92258.herokuapp.com/user/main/${userId}` ,{ withCredentials: true });
    //         if(res.status === 201){
    //           const userInfo = res.data.userInfo;
    //            return setUserInfo(userInfo)
    //           }
    //         }
          
    //       catch(err:any){
    //         console.error(err)
    //       }
    //     }
      
    //     useEffect(()=>{
    //       console.log('좋은술1');
    //       // getUserInfo(userId);
    //     },[])

    //     const handleScroll = (e:React.UIEvent<HTMLDivElement>) => {
    //       const target = e.target as HTMLElement;
    //       const { offsetHeight, scrollTop, scrollHeight } = target;
    //       if (offsetHeight + scrollTop > scrollHeight-180) {
    //         setSkip(todoCtx.items.length)
    //       }
    //     }

        // useEffect(()=>{
        //   console.log('좋은술2');
        //   if(skip){
        //     setIsloading(false);
        //     todoCtx.callApi(skip)
        //   }
        // },[skip])

        // useEffect(()=>{
        //   console.log('좋은술3');
        //   if(todoCtx.items.length>0){
        //     setIsloading(true);
        //     console.log('you did it',todoCtx.items)
        //   }else{
        //     return
        //   }
        // },[todoCtx.items])




return(
<div>main page</div>
)
}

export default MainPage;

{/* <div  onScroll={handleScroll} className={style.main_body__main__body}>
<StateTitle isAuthenticated={false} state={'Main'}></StateTitle>
<NewTodos userImg={userInfo?.profileImg} writer = {userInfo?.username} id ={userId}/>
<div className={style.main_body__main__body__comment}>
<Todos userId={userId}/>
{
  true
  ?
  null
  :
  <Loading></Loading>
}
</div>
  
</div> */}