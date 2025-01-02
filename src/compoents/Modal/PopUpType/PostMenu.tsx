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

  const {boardInfo,isOwner,stateOfFollow} = value;

  const { AuthService, UserService,SocialService } = Services;
  const {closeModal,openModal} = useModal();
  const exampleFormat = [
    ...(isOwner
      ? [
          { type: 'edit', value: '편집하기' },
          ...(boardInfo.typeOfPost === 'board'
            ? [
              { type: 'linkCopy', value: '링크 복사' },
                boardInfo.isLikeVisible
                  ? { type: 'disableShowNumberOfLike', value: '좋아요 수 숨기기' }
                  : { type: 'ableShowNumberOfLike', value: '좋아요 수 보이기' },
  
                boardInfo.isReplyAllowed
                  ? { type: 'disableComment', value: '댓글 비허용' }
                  : { type: 'ableComment', value: '댓글 허용' },
              ]
            : []
          ),
  
          { type: 'delete', value: '삭제하기' },
        ]
      : [
        // isOwner가 false일 때
        // typeOfPost가 board인 경우만 '링크 복사' 노출하고, 아닌 경우는 아무것도 추가 X
        ...(boardInfo.typeOfPost === 'board'
          ? [{ type: 'linkCopy', value: '링크 복사' }]
          : []
        ),
        stateOfFollow
          ? { type: 'unfollow', value: '언 팔로우하기' }
          : { type: 'follow', value: '팔로우하기' },
      ]
    )
  ];

  console.log(value,'value information !!')


  const deleteBoardMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.deleteBoardRequest, {
     
    onSuccess: (data) => {
      console.log('삭제 완료');
      closeModal();
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('삭제 완료 오류발생')
    }
  });
  const deleteReplyMutation = useMutation<any, AxiosError<{ message: string }>,number>(SocialService.deleteCommentRequest, {
     
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
  console.log("Modal Props:", value);
  const { isDark } = useTheme();
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };

  const handleOnClick = (type:string)=>{
    if(type === 'delete'){
      if(boardInfo.typeOfPost ==='board'){
        deleteBoardMutation.mutate(boardInfo.bno)
      }else{
        deleteReplyMutation.mutate(boardInfo.rno)
      }
    }
    else if(type === 'edit'){
      openModal({ type:'createPost', props: { isPotal:false,isForce:false,mode:'edit',isDark:isDark,type:'edit',value:{postInfo:boardInfo},modal:{width:'w-104'}} });
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
    <div className={`p-2 z-50 right-[560px] w-auto h-auto  border ${isDark?'bg-customLightBlack':'bg-customRealWhite'} ${isDark?'border-customLightGray':'border-customGray'} overflow-hidden rounded-2xl  absolute`}>
    <MenuList handleOnClick={handleOnClick} menuArray={exampleFormat}></MenuList>
    </div>
)
}

export default PostMenu;