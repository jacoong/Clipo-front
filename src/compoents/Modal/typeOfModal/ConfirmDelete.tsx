import { useMutation } from "react-query";
import Services from '../../../store/ApiService';
import { AxiosError } from 'axios';
import useModal from '../../../customHook/useModal'
import Button from '../../../compoents/Button';

const { AuthService, UserService,SocialService } = Services;

const ConfirmDelete = ({value}:any)=>{
    const {numberValue,typeOfDelete} = value;
    const {closeModal,openModal} = useModal();


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

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
    e.preventDefault();
    console.log(typeOfDelete)
    if(typeOfDelete === 'board'){
        deleteBoardMutation.mutate(numberValue)
    }else{
        deleteReplyMutation.mutate(numberValue)
    }
  }

  const preventClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
    e.stopPropagation(); // 클릭 이벤트가 오버레이로 전파되지 않도록 함
  }



  return(
   <form onSubmit={handleSubmit} >
    <div onClick={preventClick}>
        <p className="text-customRed">정말 삭제하시겠습니까?</p>
    </div>
    <Button type='submit' width='100%' padding='5px 10px'>삭제</Button>
   </form> 
)

}
export default ConfirmDelete;