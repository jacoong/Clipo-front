import React, {ReactNode,useEffect} from 'react';
import TypeOfValuesPosts from '../pageKit/TypeOfValuesPosts';
import { useParams } from 'react-router-dom';

const TagsPost =()=>{

    const {tagValue} = useParams();
    const decodedTag = tagValue ? decodeURIComponent(tagValue) : '';
    useEffect(()=>{
        console.log(decodedTag,'sava')
        },[decodedTag])
    return(
        decodedTag?
        <TypeOfValuesPosts typeOfFilter={'PostWithTags'} value={decodedTag}></TypeOfValuesPosts>
        :null
    )
}

export default TagsPost;