import React, {ReactNode,useEffect} from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';

const Postholder =({fetchedPosts,isDark}:{ fetchedPosts: userPost[],isDark:boolean }) => {


      

return (
    fetchedPosts.length>0?
    <div className=''>
    {
        fetchedPosts.map((post,index)=>(
        <div className={`no-underline border-b ${isDark?'border-customLightGray':'border-customGray'}`}key={`${index}`}>
            <PostItem index={index} isDark={isDark} postInfo={post}/>
        </div>
    ))
    }
    </div>
    :
    null
);
}



export default Postholder;