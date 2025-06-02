import PageNationStandard from "../../pageKit/PageNationStandard.tsx";
import { useEffect } from "react";
import useNavInfo from "../../../../customHook/useNavInfo";
const FollowPost = ()=>{

    const { updateNavInfo } = useNavInfo();
    updateNavInfo({type:'main',titleValue:'팔로우한 게시글',value:{type:'FollowingPost'}})


    return(
        <></>
        // <PageNationStandard typeOfFilter={'Likes'} username={LoginUser.nickName}></PageNationStandard>
    )
}

export default FollowPost