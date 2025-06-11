import { useSelector } from 'react-redux';
import { modalSelector } from '../../../store/modalSlice'
import useModal from '../../../customHook/useModal'
import {useTheme} from '../../../customHook/useTheme';
import { GoHomeFill,GoHome,GoHeart,GoHeartFill } from "react-icons/go";
import MenuList from '../../MenuList';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import Services from '../../../store/ApiService';
import {CLIENTURL} from '../../../store/axios_context';

const PostMenu = ({value}:any)=>{

  const {boardInfo,format,locationValue} = value;

  const { AuthService, UserService,SocialService } = Services;
  const {closeModal,openModal} = useModal();


  console.log(value)


  const deleteBoardMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.deleteBoardRequest, {
     
    onSuccess: (data) => {
      console.log('삭제 완료');
      closeModal();
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('삭제 완료 오류발생')
    }
  });
  const deleteReplyMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.deleteCommentRequest, {
     
    onSuccess: (data) => {
      console.log('삭제 완료');
      closeModal();
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('삭제 완료 오류발생')
    }
  });
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
  const modificateBoard = useMutation<any, AxiosError<{ message: string }>,FormData>(SocialService.modificateBoard, {
 
    onSuccess: (data) => {
      console.log('modificateBoard 완료', data);
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('modificateBoard 오류발생')
    }
  });

  const modificateComment = useMutation<any, AxiosError<{ message: string }>,FormData>(SocialService.modificateComment, {
 
    onSuccess: (data) => {
      console.log('modificateComment 완료', data);
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('modificateComment 오류발생')
    }
  });

  
  const modalState = useSelector(modalSelector);
  
  // props를 콘솔에 출력 (선택사항)
 
  const { isDark } = useTheme();
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };

  const handleOnClick = (type:string)=>{
    if(type === 'delete'){
      if(boardInfo.typeOfPost){
        console.log(boardInfo)
        openModal({type:'confirmDelete', props:{isPotal:false,isForce:true,isDark:isDark,value:{typeOfDelete:boardInfo.typeOfPost,bno:boardInfo.bno,rno:boardInfo.rno,parentRno:boardInfo.parentRno}}});}
    }
    else if(type === 'edit'){
      console.log(boardInfo,'boardInfo')
      openModal({ type:'createPost', props: { isPotal:false,isForce:false,isDark:isDark,value:{mode:'edit',postInfo:boardInfo},modal:{width:'w-104'}} });
    }
    else if(type === 'unfollow'){
      handleUnFollowMutation.mutate(boardInfo.nickName)
    }
    else if(type === 'follow'){
      handleFollowMutation.mutate(boardInfo.nickName)
    }
    else if(type === 'disableShowNumberOfLike' && boardInfo.typeOfPost ==='board'){
      const formData = new FormData();
        const isShowNumberOfLike = !boardInfo.isLikeVisable;
        formData.append(`isLikeVisible`, String(isShowNumberOfLike)); // 'files'는 서버에서 받을 필드 이름
        formData.append(`bno`, boardInfo.bno); // 'files'는 서버에서 받을 필드 이름
        modificateBoard.mutate(formData)
    }
    else if(type === 'ableComment' && boardInfo.typeOfPost ==='board'){
      const formData = new FormData();
      const isAbleComment = !boardInfo.isReplyAllowed;
      formData.append(`isReplyAllowed`, String(isAbleComment)); // 'files'는 서버에서 받을 필드 이름
      modificateBoard.mutate(formData)
    }
    else if(type === 'linkCopy'){
      const URL = (`${CLIENTURL}main/@/${boardInfo.nickName}/post/${boardInfo.bno}`)
      handleCopyLink(URL);
    }
  }

  const handleCopyLink = (linkToCopy:string) => {
    // 브라우저가 Clipboard API를 지원하는지 확인
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(linkToCopy)
        .then(() => {
          alert('링크가 클립보드에 복사되었습니다!');
          closeModal();
        })
        .catch((err) => {
          console.error('복사 실패: ', err);
          closeModal();
        });
    } else {
      // (옵션) Clipboard API가 지원되지 않을 때의 폴백
      alert('해당 브라우저는 클립보드 복사 기능을 지원하지 않습니다.');
    }
  };


return(
    <div style={{right:`${locationValue}`}} className={`z-30 p-2  w-auto h-auto  border ${isDark?'bg-customLightBlack':'bg-customRealWhite'} ${isDark?'border-customLightGray':'border-customGray'} overflow-hidden rounded-2xl`}>
    <MenuList handleOnClick={handleOnClick} menuArray={format}></MenuList>
    </div>
)
}

export default PostMenu;