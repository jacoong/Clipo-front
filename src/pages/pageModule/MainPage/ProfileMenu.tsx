import React, {ReactNode,useState,useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {useTheme} from '../../../customHook/useTheme';
import { useMutation,useQuery } from "react-query";
import { AxiosError } from 'axios';
import {simpleUserInfo,fetchedUserInfo,typeOfFilter} from '../../../store/types';
import Services from '../../../store/ApiService'
import Button from '../../../compoents/Button';
import TypeOfValuesPosts from '../pageKit/TypeOfValuesPosts';
import useModal from '../../../customHook/useModal'
import useNavInfo from '../../../customHook/useNavInfo';
import useUserProfile from '../../../customHook/useUserInfo';
import ProfileContainer from '../../../compoents/ProfileContainer';
const { UserService,SocialService } = Services;

const ProfileMenu =() => {

    const TYPEOFVALUES:typeOfFilter[] = ['Post','Replies','Likes'];

    const navigate = useNavigate();
    const { openModal } = useModal();
    const {username} = useParams();
    const { isDark } = useTheme();
    const [isOwner,setIsOwner]=useState<boolean>(false);
    const [typeOfFilter,setTypeOfFilter]=useState<typeOfFilter>('Post');
    const [showedBackButton,setShowedBackButton]=useState<boolean>(false);
    const { updateNavInfo } = useNavInfo();
    const { data: loginUserProfile, isLoading:isUserProfileLoading, isError:isUserProfileError } = useUserProfile();
    const LoginUser = isUserProfileError?undefined:loginUserProfile.body;

    updateNavInfo({titleValue:'프로필'})

    // const getUserInfoMutation = useMutation<simpleUserInfo, AxiosError<{ message: string }>>(UserService.getUserProfile, {
    //     onSuccess: (data) => {
    //       console.log('User Profile Data:', data.body.nickName,username);
    //         const currentUser = data.body.nickName;

    //         if(username){
    //             if(currentUser === username){
    //                 setIsOwner(true)
    //             } else{
    //               setIsOwner(false)
    //             }
    //             fetchedUserInfo.mutate(username);
    //         }
    //         else{
    //             setShowedBackButton(true)
    //         }

    //     },
    //     onError: (error:AxiosError) => {
    //       alert(error.response?.data ||'User Profile Data 실패');
    //     }
    //   });



    const { data: userInfo, isLoading:isFetchedUserInfoLoading, isError: isFetchedUserInfoError,refetch } = useQuery<any, AxiosError<{ message: string }>>(
      'profileInfo',
      () => SocialService.fetchedUserInfo(username as string),
      {
        enabled: Boolean(username),
        refetchOnWindowFocus:false,
        onSuccess: (data) => {
          console.log(data)
          // Make sure userProfile is defined in this scope.
          if(LoginUser){
            const currentLoginUsername = LoginUser.nickName;
            if (currentLoginUsername === username) {
              setIsOwner(true);
            } else {
              setIsOwner(false);
            }
          }else{
            alert('sibal')
          }
        },
        onError: (error) => {
          console.error('Error fetching user info:', error);
        },
      }
    ); 
    const profileInfo = isFetchedUserInfoError ? undefined : userInfo?.data.body;
    // const fetchedUserInfo = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.fetchedUserInfo, {
    //     onSuccess: (data) => {

    //       console.log('fetchedUserInfoData:', data);
    //       setFetchedUser(data.data.body)
    //     },
    //     onError: (error:AxiosError) => {
    //     //   alert(error.response?.data ||'fetchedUserInfo실패');
    //       setShowedBackButton(true)
    //     }
    //   });




      const handleFollowMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.folowUserAccount, {
     
        onSuccess: (data) => {
          console.log('팔로잉 완료', data);
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          alert('팔로잉중 오류발생')
        }
      });


      const handleUnFollowMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.unFolowUserAccount, {
     
        onSuccess: (data) => {
          console.log('언팔로잉 완료', data);
        },
        onError: (error:AxiosError) => {
        //   alert(error.response?.data ||'fetchedUserInfo실패');
          alert('언팔로잉중 오류발생')
        }
      });



      const handleFollow = ()=>{
        try{
          handleFollowMutation.mutate(profileInfo!.nickName)
        }catch{
          throw Error();
        }
      }

      const handleUnFollow = ()=>{
        try{
          handleUnFollowMutation.mutate(profileInfo!.nickName)
        }catch{
          throw Error();
        }
      }

      const handleChangeFilterdValue = (value:typeOfFilter) =>{
        setTypeOfFilter(value);
      }

      const openEditProfile = ()=>{
        openModal({ type:'editProfile', props: { isPotal:false,isForce:true,value:{profileInfo},modal:{width:'w-104',navButtonOption:{isClose:true}}} });
        // openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
      }

    const  openFollowPopup = (typeOfFilter:'Following'|'Follower')=>{
        openModal({ type:'followPopup', props: { isPotal:false,isForce:true,value:{typeOfFilter:typeOfFilter,numberOfFollower:profileInfo.followerNumber,numberOfFollowing:profileInfo.followingNumber,username:profileInfo.nickName},modal:{width:'w-104',navButtonOption:{isClose:true}}} });
        // openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
      }

    useEffect(()=>{
      if(username){
        refetch();
      }
    },[username])


return (
  isFetchedUserInfoLoading?
  <div>Loading</div>
  :
  
  profileInfo ?
    (<div className="w-full flex flex-col">  
  {/* <StateTitle isAuthenticated={userInfo.userData.isAuthenticated} state={userInfo?.userData.username!} isBack={true}></StateTitle> */}
  
  <div className="w-full h-[16rem] bg-customGray">
    {
      profileInfo.backgroundPicture
      ? <img className="w-full h-full object-cover" src={profileInfo.backgroundPicture} />
      : <div className='w-full h-full bg-emerald-500'></div>
    }
  </div>

  <div className="w-[92%] flex mx-auto flex-col">

    <div className="w-full h-[6rem] flex justify-between">

      <div className={`w-[9rem] h-[9rem] relative -top-[4.5rem] flex items-center justify-center overflow-hidden border-4 ${isDark?'border-customLightBlack bg-customLightBlack rounded-full':'border-customRealWhite bg-customRealWhite rounded-full'} `}>
        <ProfileContainer profileImg={profileInfo.profilePicture} nickName={profileInfo.nickName} height='h-full' width='w-full'></ProfileContainer>
        {/* {
        profileInfo.profilePicture
          ? <img className="w-full h-full object-cover " src={profileInfo.profilePicture} />
          : <div className='w-full h-full bg-sky-500'></div>
        } */}
      </div>

      <div className="w-[7rem] mt-[1rem]">
        {
          isOwner
        //   ? <Button handleClick={handleEdit} bolder='bold' width='large' Background_color='b-blue'><span>Edit</span></Button>
          ? <Button handleClick={openEditProfile} width='100%' color='white' padding='6px'>Edit Profile</Button>
        //   : userInfo.isFollower
          :
          profileInfo.isFollowing
          ? <Button handleClick={handleUnFollow} width='100%' color='white' padding='6px'>unFollow</Button>
          : <Button handleClick={handleFollow} width='100%' color='white' padding='6px'>Follow</Button>
        }
      </div>

    </div>

    <div className="relative">
      <div>
        <span className={`text-xl ${isDark?'text-customWhite':'text-customBlack'} font-bold`}>{profileInfo.nickName}</span>
      </div>
      <div>
        <span className={`${isDark?'text-hoverLightGray':'text-customGray'}`}>{profileInfo.email}</span>
      </div>
      <div  className={`py-3 ${isDark?'text-customWhite':'text-customBlack'}`}>
        <span>{profileInfo.description}</span>
      </div>
      <div className={`pb-3`}>
        <span className={`pr-3 ${isDark?'text-hoverLightGray':'text-customGray'}`}>{profileInfo.location}</span>
        <span className={`${isDark?'text-hoverLightGray':'text-customGray'}`}>{profileInfo.brithDay}</span>
      </div>

      <div>
        {typeOfFilter === 'Post'
        //   ? <span className="mr-[15px]">{fetchedUser.} Posts</span>
        //   : <span className="mr-[15px]">{numberOfPost} Replies</span>
        }
        <div className="mr-[15px]">

            <div onClick={()=>{openFollowPopup('Follower')}} className={`cursor-pointer mr-3 inline ${ isDark
                        ? 'hover:border-b-2 hover:border-customGray-500'
                        : 'hover:border-b-2 hover:border-customLightGray-500'
                    }`}>
            <span className='pr-1'>{profileInfo.followerNumber}</span>
            <span className={`${isDark?'text-hoverLightGray':'text-customGray'}`}>Followers</span>
            </div>

            <div  onClick={()=>{openFollowPopup('Following')}} className={`cursor-pointer mr-3 inline ${ isDark
                        ? 'hover:border-b-2 hover:border-customGray-500'
                        : 'hover:border-b-2 hover:border-customLightGray-500'
                    }`}>
            <span className='pr-1'>{profileInfo.followingNumber}</span>
            <span className={`${isDark?'text-hoverLightGray':'text-customGray'}`}>Following</span>
            </div>
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
  
  <TypeOfValuesPosts typeOfFilter={typeOfFilter} username={LoginUser.nickName}></TypeOfValuesPosts>
    </div>)
        :
      (<div>
          {
          showedBackButton
          ?
          <>
                <div>돌아가세요</div>
                <Button>돌아가기</Button>
          </>
          :
          <div>aaa</div>
          }
      </div>)
        
);
}



export default ProfileMenu;