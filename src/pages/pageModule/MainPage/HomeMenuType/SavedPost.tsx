import PageNationStandard from "../../pageKit/PageNationStandard.tsx"
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/index.js'; // 실제 경로에 맞게 수정
import { useEffect,useState } from "react";
import {UserInfo} from '../../../../store/types.js'
import useNavInfo from "../../../../customHook/useNavInfo";
const SavedPost = ()=>{

    const { updateNavInfo } = useNavInfo();

    useEffect(()=>{
        updateNavInfo({type:'main',titleValue:'저장한 포스트',value:{type:'SavedPost'}})
    },[])


    return(
     <PageNationStandard typeOfFilter={'Saved'}></PageNationStandard>
    )
}

export default SavedPost
