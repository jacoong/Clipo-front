import { useMutation,useQueryClient } from "react-query";
import Services from '../../../store/ApiService';
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal'
import Button from '../../../compoents/Button';
import {useFlashMessage} from "../../../customHook/useFlashMessage";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

const { AuthService, UserService,SocialService } = Services;

const ConfirmDelete = ({value}:any)=>{
  const navigate = useNavigate();
    const {numberValue,typeOfDelete,numberBnoValue} = value;
    const {closeModal,openModal} = useModal();
    const {showFlashMessage} = useFlashMessage();
    const queryClient = useQueryClient();

const deleteBoardMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.deleteBoardRequest, {
  onMutate:async (bno:string) => {
    await queryClient.cancelQueries(['fetchPosts', 'MainRandom']);
    showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'Processing Delete Post...'})
    const prevInfiniteData = queryClient.getQueryData(['fetchPosts', 'MainRandom']);
  
    queryClient.setQueryData(['fetchPosts', 'MainRandom'], (oldData: any) =>{
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          body: page.body.filter((post: any) => post.bno !== bno), // Corrected filter
        })),
      };
    });

   
    closeModal();

    return { prevInfiniteData };
  },
    onSuccess: (data,bno) => {
      const preDetailBoardData = queryClient.getQueryData(['fetchDetailBoardInfo',bno]); // board
      if(preDetailBoardData){
        navigate(-1);
      }

      queryClient.invalidateQueries(['fetchPosts', 'MainRandom']); // board numberOfCOmment 
      showFlashMessage({typeOfFlashMessage:'success',title:'Sucess',subTitle:'Sucessfully Post Delete'})
    },
    onError: (error:AxiosError,context:any) => {
      if (context?.prevInfiniteData) {
        queryClient.setQueryData(['fetchPosts', 'MainRandom'], context.prevInfiniteData);
      }
      showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Delete Post failed'})
    }
  });


const deleteReplyMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.deleteCommentRequest, {
     
    onSuccess: (data,numberValue,numberBnoValue) => {
      closeModal();
      queryClient.invalidateQueries(['fetchPosts', 'MainRandom']);
      queryClient.invalidateQueries(['fetchDetailBoardInfo', numberBnoValue]); // bno numberOfComment
      queryClient.invalidateQueries(['fetchPosts','Reply', numberBnoValue]); // t
      queryClient.invalidateQueries(['fetchPosts','NestRe', numberValue]); // bno numberOfComment

      showFlashMessage({typeOfFlashMessage:'success',title:'Sucess',subTitle:'Sucessfully Reply Delete'})
    },
    onError: (error:AxiosError) => {
      showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Delete Reply failed'})
    }
  });

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
    e.preventDefault();
    console.log(typeOfDelete)
    if(typeOfDelete === 'board'){
        deleteBoardMutation.mutate(numberValue)
    }else{
        deleteReplyMutation.mutate(numberValue,numberBnoValue)
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

  return(
   <form onSubmit={handleSubmit}>
    <div onClick={handleModalClick}>
        <p className="text-customRed">정말 삭제하시겠습니까?</p>
    </div>
    <Button type='submit' width='100%' padding='5px 10px'>삭제</Button>
   </form> 
)

}
export default ConfirmDelete;