import React, {ReactNode,useEffect} from 'react';
import ProfileContainer from '../ProfileContainer';
import { useNavigate } from 'react-router-dom';
import useModal from '../../customHook/useModal';
import { useParams } from 'react-router-dom';
import { HiHashtag } from "react-icons/hi2";


// const { UserService,SocialService } = Services;

const SearchTag =({tagName,isDark}:{ tagName:string,isDark:boolean }) => {
    const {closeModal} = useModal();
    const navigate = useNavigate();
    const {username} = useParams();

const fetchTagPosts =(nameOfTag:string)=>{

}

useEffect(()=>{
    if(username){
        fetchTagPosts(username)
    }
},[username])

const encodeHashFunction = (tagName:string)=>{
    return encodeURIComponent(tagName)
}

const navigateFetchPage =(tagName:string)=>{
    navigate(`tags/post/${encodeHashFunction(tagName)}`)
    return
}

function removeHash(str: string): string {
    return str.startsWith('#') ? str.slice(1) : str;
  }
  

return (
<div onClick={() => navigateFetchPage(tagName)} className={`cursor-pointer w-full flex no-underline `}>
    <div className='my-auto flex px-3 py-3 w-full'>
       <div className='w-full flex items-center'>
           <div className={`mr-2 items-center justify-center h-8 w-8 flex align-middle rounded-full border ${isDark?'border-customLightGray':'border-customGray'}`}>
            <HiHashtag/>
           </div>

            <div className='leading-5 whitespace-pre-wrap'>
                <h1>{removeHash(tagName)}</h1>
            </div>
       </div>
       </div>
</div> 
);
}



export default SearchTag;