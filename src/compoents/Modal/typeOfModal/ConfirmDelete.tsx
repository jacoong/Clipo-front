import { useMutation,useQueryClient } from "react-query";
import Services from '../../../store/ApiService';
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal'
import Button from '../../../compoents/Button';
import {useFlashMessage} from "../../../customHook/useFlashMessage";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import {Font_color_Type_1} from "../../../store/ColorAdjustion";
import TransitionDiv from "../../TransitionDiv";
import { Border_color_Type } from "../../../store/ColorAdjustion";
import { ConfirmPopupListValue } from "../../../store/types";
import ConfirmPopUp from "../ConfirmPopUp";

const { AuthService, UserService,SocialService } = Services;

const ConfirmDelete = ({value,isDark}:any)=>{
  const navigate = useNavigate();
    const {bno,typeOfDelete,rno,parentRno} = value;
    const {closeModal,openModal} = useModal();
    const {showFlashMessage} = useFlashMessage();
    const queryClient = useQueryClient();
    console.log(value);

const deleteBoardMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.deleteBoardRequest, {
  onMutate:async (bno:string) => {
    await queryClient.cancelQueries(['fetchPosts', 'MainRandom']);
    await queryClient.cancelQueries(['fetchDetailBoardInfo', rno]);
    showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'Processing Delete Post...'})
    const prevInfiniteData = queryClient.getQueryData(['fetchPosts', 'MainRandom']);
    const preDetailboardInfo = queryClient.getQueryData(['fetchDetailBoardInfo', rno]);
    if(prevInfiniteData){
      queryClient.setQueryData(['fetchPosts', 'MainRandom'], (oldData: any) =>{
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            body:{
              ...page.body,
              data: page.body.data.filter((post: any) => post.bno !== bno),
            }
          })),
        };
      });
    }

    
    // else if(preDetailboardInfo){

    // }


   
    closeModal();

    return { prevInfiniteData,preDetailboardInfo };
  },
    onSuccess: (data,bno,context) => {
      queryClient.invalidateQueries(['fetchDetailBoardInfo', rno]); // board numberOfCOmment 
      queryClient.invalidateQueries(['fetchPosts', 'MainRandom']); // board numberOfCOmment 
      showFlashMessage({typeOfFlashMessage:'success',title:'Sucess',subTitle:'Sucessfully Post Delete'})
      closeModal();
    },
    onError: (error:AxiosError,context:any) => {
      if (context?.prevInfiniteData) {
        queryClient.setQueryData(['fetchPosts', 'MainRandom'], context.prevInfiniteData);
      }
      closeModal();
      showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Delete Post failed'})
    }
  });


const deleteReplyMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.deleteCommentRequest, {
  onMutate:async (rno:string) => {
    showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'Processing Delete Post...'})
    await queryClient.cancelQueries(['fetchPosts', 'Reply', bno]);
    await queryClient.cancelQueries(['fetchPosts','NestRe', rno]);
    // const preDetailBoardData = queryClient.getQueryData(['fetchDetailBoardInfo',bno]); // board
    // const preReplyData = await queryClient.getQueryData(['fetchPosts', 'Reply', bno]);
    // const preNestReData = await queryClient.getQueryData(['fetchPosts','NestRe', parentRno]);

    closeModal();
  },
    onSuccess: (data) => {
      closeModal();
      console.log(queryClient.getQueryData(['fetchPosts','NestRe', parentRno]),'sefsefhehe')
      queryClient.invalidateQueries(['fetchPosts','Reply', bno]); // reFetch the reply state
      queryClient.refetchQueries(['fetchPosts','NestRe', parentRno]); //  reFetch the nestRe state
      queryClient.invalidateQueries(['fetchDetailBoardInfo',bno]); // bno numberOfComment of detailBoard
      console.log(queryClient.getQueryData(['fetchPosts','NestRe', parentRno]),'sefsefhehe2222')
      showFlashMessage({typeOfFlashMessage:'success',title:'Sucess',subTitle:'Sucessfully Reply Delete'})
    },
    onError: (error:AxiosError) => {
      closeModal();
      showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Delete Reply failed'})
    }
  });

const handleSubmit = ()=>{
    if(typeOfDelete === 'board'){
        deleteBoardMutation.mutate(bno)
    }else{
        deleteReplyMutation.mutate(rno)
    }
  }

  const preventClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  }

  useEffect(()=>{
    console.log(typeOfDelete)
  },[typeOfDelete])

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  };

  const handleListAction = (type:string)=>{
    if(type === 'delete'){
      handleSubmit();
    }else{
      closeModal();
    }
  }


  const ValueOfConfirmPopup: ConfirmPopupListValue[] = [
    { text: '삭제하기', type: 'delete' },
    { text: '취소하기', type: 'normal' }
  ];
  return(
   <form onSubmit={handleSubmit}>
    <ConfirmPopUp anchorClick={handleListAction}isDark={isDark} list={ValueOfConfirmPopup} title="정말 삭제하시겠어요?" text="해당 글과 관련된 태그와 내용은 삭제됩니다" ></ConfirmPopUp>    
   </form> 
)

}
export default ConfirmDelete;