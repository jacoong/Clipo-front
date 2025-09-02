import PageNationStandard from "../../pageKit/PageNationStandard.tsx";
import useNavInfo from "../../../../customHook/useNavInfo";
import { useEffect } from "react";
const FollowPost = ()=>{

    const { updateNavInfo } = useNavInfo();

    useEffect(()=>{
        updateNavInfo({type:'main',titleValue:'팔로우한 게시글',value:{type:'FollowingPost'}})
    },[])

    return(
        <PageNationStandard typeOfFilter={'FollowingPost'}></PageNationStandard>
    )
}

export default FollowPost