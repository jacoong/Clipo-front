import React, {ReactNode, useEffect,useState} from 'react';
import { userPost } from '../../store/types';
import { useMutation } from "react-query";
import { AxiosError } from 'axios';
import PostTool from './PostTool';
import { Link, useNavigate } from 'react-router-dom';
import ProfileContainer from '../ProfileContainer';
import HoverBackground from '../HoverBackground';
import Services from '../../store/ApiService';
import useModal from '../../customHook/useModal';
import ContentSlider from '../Posts/ContentSlider';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';














//  폐기 예쩡




























interface typeOfPostItem {
  bno:number,
  isDark:boolean
}

const BoardItem =({bno,isDark}:typeOfPostItem) => {
  const navigate = useNavigate()

const [boardInfo,setBoardInfo] = useState<userPost|undefined>(undefined);
const { AuthService, UserService,SocialService } = Services;
const { openModal } = useModal()
const userInfo = useSelector((state:RootState) => state.loginUserInfo);


  const fetchedBoard = useMutation<any, AxiosError<{ message: string }>,string>(SocialService.fetchedBoard, {
    onSuccess: (data) => {
      console.log('fetched board 완료', data);
      setBoardInfo(data.data.body)
    },
    onError: (error:AxiosError) => {
    //   alert(error.response?.data ||'fetchedUserInfo실패');
      alert('fetched board 오류발생')
    }
  });


  useEffect(()=>{
    fetchedBoard.mutate(String(bno));
  },[])




return (
        boardInfo
        ?
        <div className={`w-full flex no-underline border-b ${isDark?'border-customLightGray':'border-customGray'}`}>
        <div className='flex px-3 py-2 w-full'>
            <ProfileContainer profileImg={boardInfo.profilePicture} nickName={boardInfo.nickName}></ProfileContainer>
    
        <div className='overflow-hidden mx-3'>
            <div className='flex align-middle'>
                <Link className={`font-bold text-base`} to={`/main/@/${boardInfo.nickName}`}>{boardInfo.nickName}</Link>
            </div>

        <div className='my-1 leading-5 whitespace-pre-wrap'>
            <h1>{boardInfo.contents}</h1>
            <div className='my-3'>
            <div className='max-h-430px'>
                <ContentSlider contentsValue={boardInfo.boardImages} isDark={isDark}/>
            </div>
        </div>
        </div>
        </div>
        </div>
    </div> 
        :
        null
);
}


export default BoardItem;