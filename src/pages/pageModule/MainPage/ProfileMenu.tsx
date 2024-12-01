import React, {ReactNode,useState,useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useTheme} from '../../../customHook/useTheme';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import {simpleUserInfo,fetchedUserInfo,typeOfFilter} from '../../../store/types';
import Services from '../../../store/ApiService'
import Button from '../../../compoents/Button';
import TypeOfValuesPosts from '../TypeOfValuesPosts';
import useModal from '../../../customHook/useModal'
const { UserService,SocialService } = Services;



const ProfileMenu =() => {

    const TYPEOFVALUES:typeOfFilter[] = ['Post','Replies','Likes'];

    const navigate = useNavigate();
    const { openModal } = useModal();
    const {username} = useParams();
    const { isDark } = useTheme();
    const [fetchedUser,setFetchedUser]=useState<undefined|fetchedUserInfo>(undefined);
    const [isOwner,setIsOwner]=useState<boolean>(false);
    const [typeOfFilter,setTypeOfFilter]=useState<typeOfFilter>('Post');
    const [showedBackButton,setShowedBackButton]=useState<boolean>(false);


    const getUserInfoMutation = useMutation<simpleUserInfo, AxiosError<{ message: string }>>(UserService.getUserProfile, {
        onSuccess: (data) => {
          console.log('User Profile Data:', data.body.nickName,username);
            const currentUser = data.body.nickName;

            if(username){
                if(currentUser === username){
                    setIsOwner(true)
                } else{
                  setIsOwner(false)
                }
                fetchedUserInfo.mutate(username);
            }
            else{
                setShowedBackButton(true)
            }

        },
        onError: (error:AxiosError) => {
          alert(error.response?.data ||'User Profile Data 실패');
        }
      });


    const fetchedUserInfo = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.fetchedUserInfo, {
        onSuccess: (data) => {

          console.log('fetchedUserInfoData:', data);
          setFetchedUser(data.data.body)
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          setShowedBackButton(true)
        }
      });

      const handleFollowMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.folowUserAccount, {
     
        onSuccess: (data) => {
          console.log('팔로잉또는 언팔로우 완료', data);
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          alert('팔로잉 팔로우중 오류발생')
        }
      });

    useEffect(()=>{
        getUserInfoMutation.mutate();
      },[username])


      const handleFollow = ()=>{
        // setFetchedUser((prev) => ({
        //   ...prev, // 이전 상태 복사
        //   isFollowing: !prev?.isFollowing, // isFollowing 값을 반전
        // }));
        try{
          handleFollowMutation.mutate(fetchedUser!.email)
        }catch{
          throw getUserInfoMutation.mutate();
        }
      }

      const handleChangeFilterdValue = (value:typeOfFilter) =>{
        setTypeOfFilter(value);
      }

      const openEditProfile = ()=>{
        openModal({ type:'editProfile', props: { isPotal:false,isForce:true,value:{fetchedUser},modal:{width:'w-104',navButtonOption:{isClose:true}}} });
        // openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
      }

return (
        username && fetchedUser
        ?
        <>

    <div className="w-full flex flex-col">
  {/* <StateTitle isAuthenticated={userInfo.userData.isAuthenticated} state={userInfo?.userData.username!} isBack={true}></StateTitle> */}
  
  <div className="w-full h-[16rem] bg-customGray">
    {
      fetchedUser.backgroundPicture
      ? <img className="w-full h-full object-cover" src={fetchedUser.backgroundPicture} />
      : <div className='w-full h-full bg-emerald-500'></div>
    }
  </div>

  <div className="w-[92%] flex mx-auto flex-col">

    <div className="w-full h-[6rem] flex justify-between">

      <div className="w-[9rem] h-[9rem] relative -top-[4.5rem] flex items-center justify-center overflow-hidden border-4 border-white bg-white rounded-full">
        {
        fetchedUser.profilePicture
          ? <img className="w-full h-full object-cover " src={fetchedUser.profilePicture} />
          : <div className='w-full h-full bg-sky-500'></div>
        }
      </div>

      <div className="w-[7rem] mt-[1rem]">
        {
          isOwner
        //   ? <Button handleClick={handleEdit} bolder='bold' width='large' Background_color='b-blue'><span>Edit</span></Button>
          ? <Button handleClick={openEditProfile} width='100%' color='white' padding='6px'>Edit Profile</Button>
        //   : userInfo.isFollower
          :
          fetchedUser.isFollowing
          ? <Button handleClick={handleFollow} width='100%' color='white' padding='6px'>unFollow</Button>
          : <Button handleClick={handleFollow} width='100%' color='white' padding='6px'>Follow</Button>
        }
      </div>

    </div>

    <div className="relative">
      <div>
        <span className='text-xl text-customBlack font-bold'>{fetchedUser.nickName}</span>
      </div>
      <div>
        <span className={`${isDark?'text-customLightGray':'text-customGray'}`}>{fetchedUser.email}</span>
      </div>
      <div  className={`py-3 text-customBlack`}>
        <span>{fetchedUser.description}</span>
      </div>
      <div className={`pb-3 ${isDark?'text-customLightGray':'text-customGray'}`}>
        <span className={`pr-3 ${isDark?'text-customLightGray':'text-customGray'}`}>{fetchedUser.location}</span>
        <span>{fetchedUser.brithDay}</span>
      </div>

      <div>
        {typeOfFilter === 'Post'
        //   ? <span className="mr-[15px]">{fetchedUser.} Posts</span>
        //   : <span className="mr-[15px]">{numberOfPost} Replies</span>
        }
        <div className="mr-[15px]">
            <span className='pr-1'>{fetchedUser.followingNumber}</span>
            <span onClick={handleFollow} className={`pr-3 ${isDark?'text-customLightGray':'text-customGray'}`}>Following</span>
            <span className='pr-1'>{fetchedUser.followerNumber}</span>
            <span onClick={handleFollow} className={`${isDark?'text-customLightGray':'text-customGray'}`}>Followers</span>
        </div>
      </div>
    </div>

  </div>

  <div className="h-[45px] mt-2  w-full flex justify-between border-b-[0.5px] border-[#EFF3F4]">
    {TYPEOFVALUES.map((item:typeOfFilter, num) => (
      <div
        key={`${num}aesindc`}
        onClick={() => handleChangeFilterdValue(item)}
        className="w-1/2 flex justify-center items-center cursor-pointer transition-colors duration-500 ease-in-out hover:bg-[#EAEAEA]"
      >
        <div
          className={`h-full flex items-center font-semibold ${item === typeOfFilter ? 'border-b-4 border-customBlue font-black px-[6px] transition-all duration-100 ease-in-out' : ''}`}
        >
          <span>{item}</span>
        </div>
      </div>
    ))}
  </div>
  
  <TypeOfValuesPosts typeOfFilter={typeOfFilter} username={fetchedUser?.nickName}></TypeOfValuesPosts>
</div>

        </>
        :
        <div>
            {
            showedBackButton
            ?
            <>
                 <div>돌아가세요</div>
                 <Button>돌아가기</Button>
            </>
            :
            <></>
            }
        </div>
);
}



export default ProfileMenu;