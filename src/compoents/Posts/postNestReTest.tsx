
import React,{useState,ReactNode, useEffect} from 'react';
import { useInfiniteQuery } from "react-query";
import { AxiosError } from 'axios';
import Postholder from './Postholder'; 
import {useTheme} from '../../customHook/useTheme';
import Service from '../../store/ApiService';
interface typeOfBnoRno {
    parentRno?:number;
    bno?:number;
    numberOfComment:number;
}
const postNestReTest = ({parentRno,bno,numberOfComment}:typeOfBnoRno)=>{
    const { isDark } = useTheme();
    const [isInitialLoading, setIsInitialLoading] = useState(false); // 초기
    const {SocialService} = Service;


      
return (
  <div>
    {/* might be delected */}
  {/* <Postholder isDark={isDark} fetchedPosts={posts} /> */}
</div>
)
}

export default postNestReTest;