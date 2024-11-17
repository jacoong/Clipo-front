import {useContext,useEffect,useState,ReactNode} from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom'; // If yo
import { AxiosError } from 'axios';
// import style from './pageCss/MainPage.module.css;
import useModal from '../../../customHook/useModal';
import {userPost} from '../../../store/types';
// import Loading from '../pages/pageModule/Loading';
import { useMutation } from "react-query";
import Services from '../../../store/ApiService';
// export interface typeAction {
//   isOpen:boolean;
//   type:string|null;
// }




const {SocialService } = Services;


function HomeMenu() {
        const navigate = useNavigate();
        const [loading, setLoading] = useState(true);
        const [fetchedPosts, setFetchedPosts] = useState<userPost[]>([]);
        // const [userInfo,setUserInfo] = useState<UserType>()
        const { openModal } = useModal();

        



        const fetchPostsMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.fetchPosts, {
          onSuccess: (res) => {
            console.log('fetched Data:', res.data);
            const fetchedDate = res.data.body;
            setFetchedPosts(fetchedDate);
            setLoading(false);
          },
          onError: (error:AxiosError) => {
            alert(error.response?.data ||'회원가입 실패');
          }
        });


        useEffect(()=>{
            fetchPostsMutation.mutate(0)
        },[])
        

  



          return (
            <>
                      {/* <PostStuff></PostStuff> */}
                      <div>wrote post here</div>
            {loading?
            null
            :
            fetchedPosts.map((post,index)=>(
                    <div>addd</div>
                ))
                
            }
            </>
          );
  }
    
export default HomeMenu;
