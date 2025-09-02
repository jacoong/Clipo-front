import React, {ReactNode,useEffect} from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';
import { Border_color_Type } from '../../store/ColorAdjustion';
import TransitionDiv from '../TransitionDiv';
import Loading from '../Loading';
import PostItemSkeleton from '../skeleton/PostItemSkeleton';
const ReplyHolder =({fetchedPosts,isDark}:{ fetchedPosts: userPost[]|null,isDark:boolean }) => {


      
    useEffect(()=>{
        console.log(fetchedPosts,'ReplyHolder!')
    },[ReplyHolder])
    
const generateRandomNumber = () =>{
    const min = 10000;
    const max = 99999;
    const newRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min; 
    return newRandomNumber
}

 
return (
    fetchedPosts?
    <div className=''>
    {
        fetchedPosts.map((post,index)=>(
        <div key={`${generateRandomNumber()}${index}`}>
            <div className={`border-b ${Border_color_Type(isDark)}`}key={`${index}`}>
                <PostItem index={index} isDark={isDark} postInfo={post}/>
            </div>
        </div>

    ))
    }
    </div>
    :
    <>
    <Loading />
    </>

);
}



export default ReplyHolder;