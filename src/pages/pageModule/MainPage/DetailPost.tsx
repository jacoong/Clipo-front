import React, {ReactNode,useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from "react-query";
import Services from '../../../store/ApiService'
import useModal from '../../../customHook/useModal';
import {typeVaildation,userPost} from '../../../store/types';
import { AxiosError } from 'axios';
import {useTheme} from '../../../customHook/useTheme';
import useNavInfo from '../../../customHook/useNavInfo';
import CustomValidaterInput from '../../../compoents/CustomValidaterInput';
import { LuCamera } from "react-icons/lu";
import IconLink from '../../../compoents/IconLink';
import Button from '../../../compoents/Button';
import TypeOfValuesPosts from '../pageKit/TypeOfValuesPosts';
import PostItem from '../../../compoents/Posts/PostItem';

interface profileImageType  {
  previewImage:any;
  imageFile:File | undefined
}



const DetailPost =() => {

    const [boardInfo,setBoardInfo]=useState<undefined|userPost>(undefined);
    const [replyInfo,setreplyInfo]=useState<undefined|userPost>(undefined);
    const {usename,bno} = useParams();
    const { updateNavInfo } = useNavInfo();
      const { AuthService, UserService,SocialService } = Services;
          const savedData:any = localStorage.getItem('userDataKey'); 
          const {closeModal} = useModal();
          const { isDark } = useTheme();

          updateNavInfo({titleValue:'스레드',value:{isBack:true}})
          const useBoardInfo = (bno?: string) => {
            console.log(bno,'bno')
            return useQuery(
              ['fetchDetailBoardInfo', Number(bno)], // 쿼리 키: 고유한 식별자
              () => SocialService.fetchedBoard(bno!), // API 호출 함수
              {
                enabled: !!bno, // `bno`가 존재할 때만 실행
                onSuccess: (data) => {
                  console.log('fetchedBoardInfo:', data);
                },
                onError: (error: AxiosError) => {
                  console.error('Error fetching board info:', error.response?.data || 'Failed to fetch board info');
                },
              }
            );
          };
          const { data, isLoading, isError } = useBoardInfo(bno);
          // const fetchedBoardInfo = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.fetchedBoard, {
          //   onSuccess: (data) => {
    
          //     console.log('fetchedBoardInfo:', data);
          //     setBoardInfo(data.data.body)
          //   },
          //   onError: (error:AxiosError) => {
          //   //   alert(error.response?.data ||'fetchedUserInfo실패');
          //   }
          // });

          // useEffect(()=>{
          //   console.log('detailPost')
          //   if(bno){
          //       console.log(bno,'bno')
          //       fetchedBoardInfo.mutate(bno);
          //   }
          // },[bno])
          useEffect(()=>{
            console.log('refetch!2')
          },[])
if(isLoading){
  return <div>Loading...</div>;
}

if (isError) {
  return <div>Error loading data.</div>;
}

return(
  <>
    <div className={`${isDark?'border-b border-customLightGray':'border-b border-customGray'}`}>
    <PostItem postInfo={data.data.body} isDark={isDark} isDetailPost={true}/>
    </div>
    <TypeOfValuesPosts  bno={data.data.body.bno} typeOfFilter={'Reply'}></TypeOfValuesPosts>
  </>
);
}

export default DetailPost;