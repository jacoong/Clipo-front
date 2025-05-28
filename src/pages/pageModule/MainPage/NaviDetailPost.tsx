import React, {ReactNode,useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from "react-query";
import { AxiosError } from 'axios';
import Services from '../../../store/ApiService'
import { useNavigate } from 'react-router-dom';

const NaviDetailPost = ()=>{

    const {bno,rno} = useParams();
    const { AuthService, UserService,SocialService } = Services;
    const navigate = useNavigate();

        const useBoardInfo = (bno?: string) => {
            console.log(bno,'bno')
            return useQuery(
              ['fetchDetailBoardInfo', Number(bno)], // 쿼리 키: 고유한 식별자
              () => SocialService.fetchedBoard(bno!), // API 호출 함수
              {
                enabled: !!bno, // `bno`가 존재할 때만 실행
                onSuccess: (data) => {
                  reDirectDetailPost(data)
                },
                onError: (error: AxiosError) => {
                  console.error('Error fetching board info:', error.response?.data || 'Failed to fetch board info');
                },
              }
            );
          };
        const { data, isLoading, isError } = useBoardInfo(bno);
        
        const reDirectDetailPost = async (data:any) => {
        const nickName = (data.data.body.nickName)
        // 정상 경로로 이동
        if(rno){
          navigate(`/main/@/${nickName}/post/${bno}/comment/${rno}`);
        }else if(bno){
          navigate(`/main/@/${nickName}/post/${bno}`);
        }else{
          navigate(`/pageNotFOund`);
        }
      };
      


    return(
        <></>
    )
}

export default NaviDetailPost;

