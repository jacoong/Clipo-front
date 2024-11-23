import React, {ReactNode} from 'react';
import { userPost } from '../../store/types';
import PostItem from './PostItem';

const Postholder =({fetchedPosts,isDark}:{ fetchedPosts: userPost[],isDark:boolean }) => {


return (
    <div className=''>
    {
                   fetchedPosts.map((post,index)=>(
                    <PostItem isDark={isDark} postInfo={post}/>
                ))
    }
    </div>
);
}



export default Postholder;