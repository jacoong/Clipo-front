import React, {ReactNode,useEffect} from 'react';
import ProfileContainer from '../ProfileContainer';
import { Link } from 'react-router-dom';
import {UserInfo} from '../../store/types';
import useModal from '../../customHook/useModal';
import Services from '../../store/ApiService';
import PostItem from '../Posts/PostItem';
import {activityDetailType,activityType} from '../../store/types'
import UserAccount from '../Posts/UserAccount';

interface ActivityDetailProps {
    activity:activityDetailType;
    isDark: boolean;
  }


const ActivityDetail =({activity,isDark}:ActivityDetailProps) => {
    const { from, bno, rno, type,userProfileImage,boardOneImage } = activity;
    const { openModal, closeModal } = useModal();
    

const showUserAccount = (action:string)=>{
    if(action === 'open'){
    openModal({ type:'accountInfo', props: { isPotal:true, potalSpot:`ActivityDetail${from}`,value:{username:from,locationValue:'480px'}} });
    }else{
        closeModal();
    }
    }

const renderWIthinCondition = ()=>{
    switch (type) {
        case 'board':
          return `님이 새 게시물을 올렸습니다:`;
        case 'reply':
          return `님이 게시글에 댓글을 남겼습니다`;
        case 'nestRe':
            return '님이 내 댓글에 글을 남겼습니다.';
        case 'like':
            if(rno !== null){
                return `님이 회원님의 게시물을 좋아합니다.`;
            }else{
                return `님이 회원님의 댓글을 좋아합니다.`;
            }
        case 'reference':
            if(rno !== null){
                return `님이 회원님을 게시글에서 언급했습니다.`;
            }else{
                return `님이 회원님을 댓글에서 언급했습니다.`;
            }
        case 'follow':
          return `님이 회원님을 팔로우하기 시작했습니다.`;
        case 'longtime':
          return `님이 오랜만에 게시글을 올렸습니다.`;
        case 'mention':
            return `님이 회원님을 맨션 하였습니다.`;
        default:
          return '';
      }
}



return (
    <div className={`cursor-pointer w-full flex no-underline`}>
    <div className='flex px-1 py-2 w-full'>
    <div className='w-full ml-3'>
        <div className='flex h-full items-start align-middle'>
            <UserAccount isDark={isDark} username={from} idNum={`${type}${from}`}></UserAccount>
            <h1>{renderWIthinCondition()}</h1>
    
    </div>
    <div className='absolute w-full' id={`ActivityDetail${from}`}></div>
    <div>

    </div>
    </div>
    </div>
    </div> 
);
}



export default ActivityDetail;