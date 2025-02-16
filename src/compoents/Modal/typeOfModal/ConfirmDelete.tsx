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
    const {bno,typeOfDelete,rno,parentRno} = value;
    const {closeModal,openModal} = useModal();
    const {showFlashMessage} = useFlashMessage();
    const queryClient = useQueryClient();

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
            body: page.body.filter((post: any) => post.bno !== bno), // Corrected filter
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
    },
    onError: (error:AxiosError,context:any) => {
      if (context?.prevInfiniteData) {
        queryClient.setQueryData(['fetchPosts', 'MainRandom'], context.prevInfiniteData);
      }
      showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Delete Post failed'})
    }
  });


const deleteReplyMutation = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.deleteCommentRequest, {
  onMutate:async () => {
    showFlashMessage({typeOfFlashMessage:'brand',title:'Processing',subTitle:'Processing Delete Post...'})
    await queryClient.cancelQueries(['fetchPosts', 'Reply', bno]);
    await queryClient.cancelQueries(['fetchPosts','NestRe', rno]);
    const preDetailBoardData = queryClient.getQueryData(['fetchDetailBoardInfo',bno]); // board
    const preReplyData = await queryClient.getQueryData(['fetchPosts', 'Reply', bno]);
    const preNestReData = await queryClient.getQueryData(['fetchPosts','NestRe', parentRno]);

    closeModal();
  },
    onSuccess: (data) => {
      closeModal();
      console.log(queryClient.getQueryData(['fetchPosts','NestRe', parentRno]),'sefsefhehe')
    queryClient.invalidateQueries(['fetchPosts','Reply', bno]); // t
      queryClient.invalidateQueries(['fetchPosts','NestRe', parentRno]); // bno numberOfComment
      queryClient.invalidateQueries(['fetchDetailBoardInfo',bno]); // bno numberOfComment
      console.log(queryClient.getQueryData(['fetchPosts','NestRe', parentRno]),'sefsefhehe2222')
      showFlashMessage({typeOfFlashMessage:'success',title:'Sucess',subTitle:'Sucessfully Reply Delete'})
    },
    onError: (error:AxiosError) => {
      closeModal();
      showFlashMessage({typeOfFlashMessage:'error',title:'Error',subTitle:'Delete Reply failed'})
    }
  });

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
    e.preventDefault();
    console.log(typeOfDelete)
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