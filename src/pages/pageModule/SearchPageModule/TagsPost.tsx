import React, { useEffect } from 'react';
import PageNationStandard from '../pageKit/PageNationStandard.tsx';
import { useParams } from 'react-router-dom';
import useNavInfo from '../../../customHook/useNavInfo';

const TagsPost =()=>{
    const { updateNavInfo } = useNavInfo();
    const {tagValue} = useParams();
    const decodedTag = tagValue ? decodeURIComponent(tagValue) : '';

    useEffect(() => {
        updateNavInfo({ type: 'search', titleValue: `${decodedTag || ''}` });
    }, [decodedTag, updateNavInfo]);

    return(
        decodedTag?
        <PageNationStandard typeOfFilter={'PostWithTags'} value={decodedTag}></PageNationStandard>
        :null
    )
}

export default TagsPost;
