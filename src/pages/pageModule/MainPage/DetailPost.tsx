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
import PageNationStandard from '../pageKit/PageNationStandard.tsx';
import CommentPageNation from '../pageKit/CommentPageNation';
import PostItem from '../../../compoents/Posts/PostItem';
import { Border_color_Type } from '../../../store/ColorAdjustion';
import { useBoardInfo } from '../../../customHook/useBoardInfo';
import { usePageParams } from '../../../customHook/usePageParams';
import Loading from '../../../compoents/Loading';

interface profileImageType  {
  previewImage:any;
  imageFile:File | undefined
}



const DetailPost =() => {

    const {usename,bno,rno,nsetRe} = useParams();
    const { updateNavInfo } = useNavInfo();
    const [initialPage, setInitialPage] = useState<number|null>(null) 

          const pageParams = bno && rno
          ? ({ parentId: Number(bno), childId: Number(rno),  kind: 'reply' } as const)
          : undefined;

          const savedData:any = localStorage.getItem('userDataKey'); 
          const {closeModal} = useModal();
          const { isDark } = useTheme();

          const { pageNumber, isLoading: isLoadingPage } = usePageParams(pageParams);
          const { data, isLoading:isLoadingBoard, isError } = useBoardInfo(bno);
      
          
          useEffect(() => {
            if(!isLoadingPage){
              console.log('pageNumber',pageNumber)
              setInitialPage(pageNumber);
            }
          }, [pageNumber,isLoadingPage]);

        useEffect(()=>{
          updateNavInfo({type:'thread',titleValue:'스레드',value:{isBack:true}})
        },[])



if(isLoadingBoard || isLoadingPage || initialPage === null){

  return  <div className='w-full h-[50vh] flex items-center justify-center'><Loading /></div>;
}

if (isError) {
  return <div>Error loading data.</div>;
}

return(
  <>
    <div className={`border-b ${Border_color_Type(isDark)}`}>
    <PostItem postInfo={data.data.body} isDark={isDark} isDetailPost={true}/>
    </div>
    {
      rno && bno && initialPage !== null ? 
      <CommentPageNation typeOfFilter='BiPagenation' numberOfComment={data.data.body.numberOfComments} parentId={Number(bno)} childId={Number(rno)} initialPage={initialPage} ></CommentPageNation>
      :
      data.data.body.isReplyAllowed
      ?
      <PageNationStandard  bno={data.data.body.bno} typeOfFilter={'Reply'}></PageNationStandard>
      :
      <p>댓글이 중지 되었습니다.</p>
    }
    {
      
    }
  </>
);
}

export default DetailPost;