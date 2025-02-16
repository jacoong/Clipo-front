import {useEffect,useState} from 'react';
import useModal from '../../../customHook/useModal';
import {useTheme} from '../../../customHook/useTheme';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery,useMutation,useQueryClient } from "react-query";
import { AxiosError } from 'axios';
import Services from '../../../store/ApiService'
import { BiError } from "react-icons/bi";
import { simpleUserInfo } from '../../../store/types';
import Button from '../../Button';
import useUserProfile from '../../../customHook/useUserInfo';
import ProfileContainer from '../../ProfileContainer';

const { UserService,SocialService } = Services;

const AccountInfo = ({value}:any)=>{
  const navigate = useNavigate();
  const [isOwned,setIsOwned] = useState(false);
  const [isPopupLodaed,setIsPopupLodaed] = useState(false);
  const { isDark } = useTheme();
  const { closeModal } = useModal()
  const {username} = value;
  const { data: loginUserProfile } = useUserProfile();
  // const username = 'nickN';
  // const userProfile = useQueryClient().getQueryData<simpleUserInfo>('userProfile');
  // props를 콘솔에 출력 (선택사항)
  console.log("Modal Props:", value);

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };
  const handleMouseLeave = () => {
    // closeModal()
  };



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
      handleFollowMutation.mutate(username)
    }catch{
      throw Error();
    }
  }

  const handleUnFollow = ()=>{
    try{
      handleUnFollowMutation.mutate(username)
    }catch{
      throw Error();
    }
  }



  
  const { data:userInfo, isLoading, isError} = useQuery<any,AxiosError<{ message: string }>>(
    ['fetchedUserInfo', username],
  () => SocialService.fetchedUserInfo(username as string),
  {
    enabled: !!username,
    onSuccess: (data) => {
      // Make sure userProfile is defined in this scope.
      const currentLoginUsername = loginUserProfile?.body?.nickName;
      if (currentLoginUsername === username) {
        setIsOwned(true);
      } else {
        setIsOwned(false);
      }

      setIsPopupLodaed(true)
      },
    onError: (error) =>{
      throw error
      console.error('error')
    }
    }
  );

  




if(isError){
  <div onMouseLeave={handleMouseLeave} className={`p-4 z-50  w-60 h-auto border  ${isDark? 'bg-customBlack border-customLightBlack ':'bg-customRealWhite  border-customGray'} overflow-hidden rounded-2xl  absolute`}>
  <div className='flex items-center justify-center flex-col'>
    <BiError className='pb-5 text-6xl'></BiError>
    <div>
    <p className='text-center'>죄송합니다. 로드에 실패했습니다. 조금 이후에 다시 시작해 주세요</p>
    </div>
  </div>
</div>
}

const data = userInfo?.data?.body || {};
return(
  isPopupLodaed?
    <div onMouseLeave={handleMouseLeave} className={`p-4 z-50  w-80 h-auto border ${isDark? 'bg-customBlack border-customLightBlack ':'bg-customRealWhite border-customGray'} overflow-hidden rounded-2xl  absolute`}>
        <div className={`flex justify-between items-center`}>
          <div className='flex py-3 flex-col justify-between'>
            <p className='text-3xl'>{data.nickName}</p>
            <p>{data.email}</p>
          </div>
          <div className='w-16 h-16'>
            <ProfileContainer profileImg={data.profilePicture} nickName={data.nickName} width='w-full' height='h-full'></ProfileContainer>
          </div>
        </div>

        <div className='pb-2'>
          {data.description?
          <p>{data.description}</p>
          :
          null
          }    
          <div className='flex'>
          {data.location?
          <p className='mr-2'>{data.location}</p>
          :
          null
          }
            {data.brithDay?
          <p>{data.brithDay}</p>
          :
          null
            }    
        </div>
        </div>


        <div className="w-full">
        {
          isOwned
        //   ? <Button handleClick={handleEdit} bolder='bold' width='large' Background_color='b-blue'><span>Edit</span></Button>
          ? <Button handleClick={()=>{navigate(`/main/@/${data.nickName}`)}} width='100%' color='white' padding='6px'>Go ProfileMenu</Button>
        //   : userInfo.isFollower
          :
          data.isFollowing
          ? <Button handleClick={handleUnFollow} width='100%' color='white' padding='6px'>unFollow</Button>
          : <Button handleClick={handleFollow} width='100%' color='white' padding='6px'>Follow</Button>
        }
      </div>

    </div>
  :
  null
)
}

export default AccountInfo;