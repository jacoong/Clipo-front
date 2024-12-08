import React, {ReactNode,useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from "react-query";
import Services from '../../../store/ApiService'
import useModal from '../../../customHook/useModal';
import {typeVaildation,userPost} from '../../../store/types';
import { AxiosError } from 'axios';
import {useTheme} from '../../../customHook/useTheme';
import CustomValidaterInput from '../../../compoents/CustomValidaterInput';
import { LuCamera } from "react-icons/lu";
import IconLink from '../../../compoents/IconLink';
import Button from '../../../compoents/Button';
import TypeOfValuesPosts from '../TypeOfValuesPosts';
import PostItem from '../../../compoents/Posts/PostItem';

interface profileImageType  {
  previewImage:any;
  imageFile:File | undefined
}



const DetailPost =() => {

    const [boardInfo,setBoardInfo]=useState<undefined|userPost>(undefined);
    const [replyInfo,setreplyInfo]=useState<undefined|userPost>(undefined);
    const {usename,bno} = useParams();

      const { AuthService, UserService,SocialService } = Services;
          const savedData:any = localStorage.getItem('userDataKey'); 
          const {closeModal} = useModal();
          const { isDark } = useTheme();



          const fetchedBoardInfo = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.fetchedBoard, {
            onSuccess: (data) => {
    
              console.log('fetchedBoardInfo:', data);
              setBoardInfo(data.data.body)
            },
            onError: (error:AxiosError) => {
            //   alert(error.response?.data ||'fetchedUserInfo실패');
            }
          });

          useEffect(()=>{
            console.log('detailPost')
            if(bno){
                console.log(bno,'bno')
                fetchedBoardInfo.mutate(bno);
            }
          },[bno])

return(
    boardInfo?
    <>
    <PostItem postInfo={boardInfo} isDark={isDark}/>
    <TypeOfValuesPosts  bno={boardInfo.bno} typeOfFilter={'Reply'}></TypeOfValuesPosts>
    </>
  :
  null
);
}

export default DetailPost;