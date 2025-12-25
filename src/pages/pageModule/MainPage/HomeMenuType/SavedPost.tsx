import PageNationStandard from "../../pageKit/PageNationStandard.tsx"
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/index.js'; // 실제 경로에 맞게 수정
import { useEffect,useState } from "react";
import {UserInfo} from '../../../../store/types.js'
import useNavInfo from "../../../../customHook/useNavInfo";
import { useQueryClient } from "react-query";
const SavedPost = ()=>{

    const { updateNavInfo } = useNavInfo();
    const queryClient = useQueryClient();
    const typeOfFilter = 'Saved';

    useEffect(()=>{
        updateNavInfo({type:'main',titleValue:'저장한 포스트',value:{type:'SavedPost'}})
        queryClient.refetchQueries(['fetchPosts', typeOfFilter]);
    },[queryClient, updateNavInfo, typeOfFilter])


    return(
     <PageNationStandard typeOfFilter={typeOfFilter}></PageNationStandard>
    )
}

export default SavedPost
