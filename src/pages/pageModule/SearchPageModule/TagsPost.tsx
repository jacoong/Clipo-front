import React, {ReactNode,useEffect} from 'react';
import PageNationStandard from '../pageKit/PageNationStandard.tsx';
import { useParams } from 'react-router-dom';

const TagsPost =()=>{

    const {tagValue} = useParams();
    const decodedTag = tagValue ? decodeURIComponent(tagValue) : '';
    useEffect(()=>{
        console.log(decodedTag,'sava')
        },[decodedTag])
    return(
        decodedTag?
        <PageNationStandard typeOfFilter={'PostWithTags'} value={decodedTag}></PageNationStandard>
        :null
    )
}

export default TagsPost;