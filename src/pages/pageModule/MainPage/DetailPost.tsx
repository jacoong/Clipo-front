import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {useTheme} from '../../../customHook/useTheme';
import useNavInfo from '../../../customHook/useNavInfo';
import PageNationStandard from '../pageKit/PageNationStandard.tsx';
import CommentPageNation from '../pageKit/CommentPageNation';
import PostItem from '../../../compoents/Posts/PostItem';
import { Border_color_Type } from '../../../store/ColorAdjustion';
import { useBoardInfo } from '../../../customHook/useBoardInfo';
import Loading from '../../../compoents/Loading';
import NoNumberLoad from '../../../compoents/NoNumberLoad';
import Services from '../../../store/ApiService';
import { LiaCommentSlashSolid } from "react-icons/lia";

const DetailPost =() => {
    const { SocialService } = Services;
    const {bno,rno,nestRe} = useParams();
    const { updateNavInfo } = useNavInfo();
    const { isDark } = useTheme();

    const targetBno = bno ? Number(bno) : undefined;
    const targetReplyId = rno ? Number(rno) : undefined;
    const targetNestId = nestRe ? Number(nestRe) : undefined;

    const { data, isLoading:isLoadingBoard, isError } = useBoardInfo(bno);

    const { data: replyPageData, isLoading: isLoadingReplyPage } = useQuery(
      ['replyPageNumber', targetBno, targetReplyId],
      () => SocialService.fetchReplyPageNumber(targetBno!, targetReplyId!),
      {
        enabled: !!(targetBno && targetReplyId),
        refetchOnWindowFocus: false,
      }
    );

    const { data: nestPageData, isLoading: isLoadingNestPage } = useQuery(
      ['nestRePageNumber', targetReplyId, targetNestId],
      () => SocialService.fetchNestRePageNumber(targetReplyId!, targetNestId!),
      {
        enabled: !!(targetReplyId && targetNestId),
        refetchOnWindowFocus: false,
      }
    );

    const replyInitialPage = (replyPageData as any)?.data?.body?.pageNumber ?? 0;
    const nestInitialPage = (nestPageData as any)?.data?.body?.pageNumber ?? 0;

    useEffect(()=>{
      updateNavInfo({type:'thread',titleValue:'스레드',value:{isBack:true}})
    },[])



if(
  isLoadingBoard ||
  (targetReplyId && isLoadingReplyPage) ||
  (targetNestId && isLoadingNestPage)
){

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
      rno && bno ? 
      <CommentPageNation 
        isDark={isDark} 
        typeOfFilter='BiPagenation' 
        numberOfComment={data.data.body.numberOfComments} 
        parentId={Number(bno)} 
        childId={Number(rno)} 
        initialPage={replyInitialPage}
        targetReplyId={targetReplyId}
        targetNestId={targetNestId}
        nestInitialPage={nestInitialPage}
        autoLoadNest={!!targetNestId}
       />
      :
      data.data.body.isReplyAllowed
      ?
      <PageNationStandard  bno={data.data.body.bno} typeOfFilter={'Reply'} initialPage={0}></PageNationStandard>
      :
      <NoNumberLoad
        title="댓글이 중지되었습니다"
        description={'이 게시물의 댓글 작성이 중지되었습니다.\n다른 게시물을 확인해보세요.'}
        isDark={isDark}
        icon={
          <LiaCommentSlashSolid ></LiaCommentSlashSolid>
        }
      />
    }
    {
      
    }
  </>
);
}

export default DetailPost;
