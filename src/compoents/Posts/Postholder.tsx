import React, {ReactNode,useEffect} from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';
import { Border_color_Type } from '../../store/ColorAdjustion';
import TransitionDiv from '../TransitionDiv';
const Postholder =({fetchedPosts,isDark}:{ fetchedPosts: userPost[],isDark:boolean }) => {


      

return (
    fetchedPosts.length>0?
    <div className=''>
    {
        fetchedPosts.map((post,index)=>(
        <div>
            <div className={`border-b ${Border_color_Type(isDark)}`}key={`${index}`}>
                <PostItem index={index} isDark={isDark} postInfo={post}/>
            </div>
        </div>

    ))
    }
    </div>
    :
    null
);
}



export default Postholder;