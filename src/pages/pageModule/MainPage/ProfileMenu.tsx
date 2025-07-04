import React, {ReactNode,useState,useEffect} from 'react';
import { useLocation, useParams, } from 'react-router-dom';
import {useTheme} from '../../../customHook/useTheme';
import { useMutation,useQuery } from "react-query";
import { AxiosError } from 'axios';
import {simpleUserInfo,fetchedUserInfo,typeOfFilter} from '../../../store/types';
import Services from '../../../store/ApiService'
import Button from '../../../compoents/Button';
import PageNationStandard from '../pageKit/PageNationStandard.tsx';
import useModal from '../../../customHook/useModal'
import useNavInfo from '../../../customHook/useNavInfo';
import useUserProfile from '../../../customHook/useUserInfo';
import ProfileContainer from '../../../compoents/ProfileContainer';
import ButtonOfFollow from '../../../compoents/ButtonOfFollow';
import {useQueryClient} from 'react-query';
import { Border_color_Type } from '../../../store/ColorAdjustion';
const { UserService,SocialService } = Services;

const ProfileMenu =() => {

    const TYPEOFVALUES:typeOfFilter[] = ['Post','Replies','Likes'];

    const location = useLocation(); 
    const { updateNavInfo } = useNavInfo();
    const { openModal } = useModal();
    const {username} = useParams();
    const { isDark } = useTheme();
    const [isOwner,setIsOwner]=useState<boolean>(false);
    const [typeOfFilter,setTypeOfFilter]=useState<typeOfFilter>('Post');
    const [showedBackButton,setShowedBackButton]=useState<boolean>(false);
    const { data: loginUserProfile, isLoading:isUserProfileLoading, isError:isUserProfileError } = useUserProfile();
    const LoginUser = isUserProfileError?undefined:loginUserProfile.body;
    const queryClient = useQueryClient();

    useEffect(()=>{
      console.log('fetch new query data')
      queryClient.refetchQueries(['fetchPosts'])
      queryClient.refetchQueries(['profileInfo'])
    },[])

    useEffect(()=>{
      const isBack = location.state?.isBack === true;
      console.log(isBack,'isBack')
      if (isBack) {
        updateNavInfo({type:'profile',titleValue:'프로필',value:{isBack:isBack}})
      }else{
        updateNavInfo({type:'profile',titleValue:'프로필'})
      }
    },[location.state])
 


    const { data: userInfo, isLoading:isFetchedUserInfoLoading, isError: isFetchedUserInfoError,refetch } = useQuery<any, AxiosError<{ message: string }>>(
      ['profileInfo',username],
      () => SocialService.fetchedUserInfo(username as string),
      {
        enabled: Boolean(username),
        refetchOnWindowFocus:false,
        onSuccess: (data) => {
          console.log(data,username)
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

      const handleChangeFilterdValue = (value:typeOfFilter) =>{
        setTypeOfFilter(value);
      }

    const  openFollowPopup = (typeOfFilter:'Following'|'Follower')=>{
        openModal({ type:'followPopup', props: { isForce:true,isModalLayer:true,value:{typeOfFilter:typeOfFilter,numberOfFollower:profileInfo.followerNumber,numberOfFollowing:profileInfo.followingNumber,username:profileInfo.nickName},modal:{width:'w-104',navButtonOption:{isClose:true}}} });
        // openModal({ type:'username', props: { isPotal:false,isForce:true,modal:{width:'w-96'}} });
      }



    const returnDefaultBackgroundColor = (value:string)=>{
          const num = parseInt(value.replace("bg_default_", ""), 10); 
          switch (num) {
              case 1:
                  return "bg-blue-500";
                  break;
              case 2:
                return "bg-customGray";
                  break;
              case 3:
                return "bg-hovercustomBlack";
                  break;
              case 4:
                return "bg-customBlue";
                  break;
              default:
                return "bg-customBlue";
              }
    }

return (
  isFetchedUserInfoLoading?
  <div>Loading</div>
  :
  
  profileInfo ?
    (<div className="w-full flex flex-col">  
  {/* <StateTitle isAuthenticated={userInfo.userData.isAuthenticated} state={userInfo?.userData.username!} isBack={true}></StateTitle> */}
  
  <div className="w-full h-[16rem]">

  {profileInfo.backgroundPicture?.startsWith("bg_default_") ? (
       <div className={`w-full h-full ${
        returnDefaultBackgroundColor(profileInfo.backgroundPicture)}`}/>
        // <div className={`w-full h-full bg-emerald-500`}/>
      ) : (
      <img className="w-full h-full object-cover" src={profileInfo.backgroundPicture} />
      )}
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

        <div className='mt-[1rem]'>
        <ButtonOfFollow isOwner={isOwner} isDark={isDark} profileInfo={profileInfo}></ButtonOfFollow>
        </div>


    </div>

    <div className="relative">
      <div>
        <span className={`text-xl ${isDark?'text-customWhite':'text-customBlack'} font-bold`}>{profileInfo.nickName}</span>
      </div>
      <div>
        <span className={`${isDark?'text-hoverLighray':'text-customGray'}`}>{profileInfo.email}</span>
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

  <div className={`h-[45px] mt-2  w-full flex justify-between border-b-[0.5px] ${Border_color_Type(isDark)}`}>
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
  
  <PageNationStandard typeOfFilter={typeOfFilter} username={LoginUser.nickName}></PageNationStandard>
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