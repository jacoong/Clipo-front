import { useSelector } from 'react-redux';
import { modalSelector } from '../../../store/modalSlice'
import useModal from '../../../customHook/useModal'
import {useTheme} from '../../../customHook/useTheme';
import { GoHomeFill,GoHome,GoHeart,GoHeartFill } from "react-icons/go";
import MenuList, { MenuAction, MenuListItem } from '../../MenuList';
import { useMutation, useQueryClient } from "react-query";
import { AxiosError } from 'axios';
import Services from '../../../store/ApiService';
import {CLIENTURL} from '../../../store/axios_context';
import { useFlashMessage } from 'src/customHook/useFlashMessage';
import { Bg_color_Type_3, Border_color_Type } from '../../../store/ColorAdjustion';
const PostMenu = ({value}:any)=>{

  const {boardInfo,format,locationValue,isMobile} = value;
  const menuFormat = (format ?? []) as MenuListItem[];

  const { AuthService, UserService,SocialService } = Services;
  const queryClient = useQueryClient();
  const {closeModal,openModal} = useModal();
  const {flashMessage,showFlashMessage} = useFlashMessage();

  const patchBookmarkState = (postId: number, isBookmarked: boolean) => {
    if (!postId && postId !== 0) return;
    const normalizedId = Number(postId);
    if (Number.isNaN(normalizedId)) return;

    const patchPost = (post: any) => {
      if (!post) return post;
      const targetId = Number(post?.bno ?? post?.boardId ?? post?.postId);
      if (targetId !== normalizedId) return post;
      return {
        ...post,
        isBookmarked: isBookmarked,
        isBookmark: isBookmarked,
        isBookMarked: isBookmarked,
      };
    };

    const patchInfinitePages = (oldData: any) => {
      if (!oldData?.pages) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => {
          const body = page?.body;
          if (!body || !Array.isArray(body.data)) return page;
          return {
            ...page,
            body: {
              ...body,
              data: body.data.map(patchPost),
            },
          };
        }),
      };
    };

    queryClient.getQueriesData<any>(['fetchPosts']).forEach(([key]) => {
      queryClient.setQueryData(key, (oldData: any) => patchInfinitePages(oldData));
    });

    queryClient.setQueryData(['fetchDetailBoardInfo', normalizedId], (oldData: any) => {
      if (!oldData?.data?.body) return oldData;
      return {
        ...oldData,
        data: {
          ...oldData.data,
          body: patchPost(oldData.data.body),
        },
      };
    });
  };

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
  const modificateComment = useMutation<any, AxiosError<{ message: string }>,FormData>(SocialService.modificateComment, {
 
    onSuccess: (data) => {
      console.log('modificateComment 완료', data);
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('modificateComment 오류발생')
    }
  });

  const bookmarkAddMutation = useMutation<any, AxiosError<{ message: string }>, string>(
    SocialService.bookmarkAdd,
    {
      onMutate:async()=>{
        closeModal();
         showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'북마크 저장중...'})
      },
      onSuccess: (data, variables) => {
        showFlashMessage({typeOfFlashMessage:'success',title:'Sucess',subTitle:'북마크 저장완료'})
        console.log('bookmark 추가 완료', data);
        const targetBno = Number(variables);
        patchBookmarkState(targetBno, true);

      },
      onError: (error: AxiosError) => {
          showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'북마크 저장 실패',})
        alert('북마크 추가 중 오류가 발생했습니다.');
      },
    },
  );

  const bookmarkDeleteMutation = useMutation<any, AxiosError<{ message: string }>, string>(
    SocialService.bookmarkDelete,
    {
        onMutate:async()=>{
        closeModal();
        showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'북마크 해제중...'})
      },
      onSuccess: (data, variables) => {
        showFlashMessage({typeOfFlashMessage:'success',title:'Sucess',subTitle:'북마크 해제완료'})
        const targetBno = Number(variables);
        patchBookmarkState(targetBno, false);
      },
      onError: (error: AxiosError) => {
          showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'북마크 해제실패',})
      },
    },
  );
 
  
  const modalState = useSelector(modalSelector);
  
  // props를 콘솔에 출력 (선택사항)
 
  const { isDark } = useTheme();
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };

  const handleOnClick = (type: MenuAction)=>{
    if(type === 'delete'){
      if(boardInfo.typeOfPost){
        console.log(boardInfo)
        openModal({type:'confirmDelete', props:{isForce:true,isDark:isDark,value:{typeOfDelete:boardInfo.typeOfPost,bno:boardInfo.bno,rno:boardInfo.rno,parentRno:boardInfo.parentRno}}});}
    }
    else if(type === 'edit'){
      console.log(boardInfo,'boardInfo')
      openModal({ type:'createPost', props: {isConfirmClosed:true,isModalLayer:true,isForce:false,isDark:isDark,value:{mode:'edit',postInfo:boardInfo},modal:{isCenterMessage:'스레드 편집하기',width:'w-116', height:'h-64',navButtonOption:{isClose:true}}} });
    }
    else if(type === 'unfollow'){
      handleUnFollowMutation.mutate(boardInfo.nickName)
    }
    else if(type === 'follow'){
      handleFollowMutation.mutate(boardInfo.nickName)
    }
    else if(type === 'disableShowNumberOfLike' && boardInfo.typeOfPost ==='board'){
      openModal({
        type:'confirmAdditionalOptionModal',
        props:{
          isForce:true,
          isDark:isDark,
          value:{optionType:'disableShowNumberOfLike', boardInfo}
        }
      });
    }
    else if(type === 'ableComment' && boardInfo.typeOfPost ==='board'){
      openModal({
        type:'confirmAdditionalOptionModal',
        props:{
          isForce:true,
          isDark:isDark,
          value:{optionType:'ableComment', boardInfo}
        }
      });
    }
    else if(type === 'linkCopy'){
      const URL = (`${CLIENTURL}main/@/${boardInfo.nickName}/post/${boardInfo.bno}`)
      handleCopyLink(URL);
    }
    else if(type === 'Bookmark' && boardInfo.typeOfPost === 'board'){
      const targetBno = boardInfo.bno ?? boardInfo.boardId;
      console.log(boardInfo,'aaa')
      if (targetBno !== undefined && targetBno !== null) {
        bookmarkAddMutation.mutate(String(targetBno));
      }
    }
    else if(type === 'unBookmark' && boardInfo.typeOfPost === 'board'){
      const targetBno = boardInfo.bno ?? boardInfo.boardId;
      if (targetBno !== undefined && targetBno !== null) {
        bookmarkDeleteMutation.mutate(String(targetBno));
      }
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


    const containerClasses = isMobile
    ? `z-30 w-full mx-auto px-4 pt-4 border ${Bg_color_Type_3(isDark)} ${Border_color_Type(isDark)} overflow-hidden rounded-2xl`
    : `z-30 p-2 w-auto h-auto border ${Bg_color_Type_3(isDark)} ${Border_color_Type(isDark)} overflow-hidden rounded-2xl`;



return(
  format?
   <div style={{ right: isMobile ? undefined : `${locationValue}` }} className={containerClasses}>
    <MenuList isMobile={isMobile} isDark={isDark} handleOnClick={handleOnClick} menuArray={menuFormat}></MenuList>
    </div>
    :
    <></>
)
}

export default PostMenu;
