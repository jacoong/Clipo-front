import PageNationStandard from "../../pageKit/PageNationStandard.tsx";
import useNavInfo from "../../../../customHook/useNavInfo";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
const FollowPost = ()=>{

    const { updateNavInfo } = useNavInfo();
    const queryClient = useQueryClient();
    const typeOfFilter = 'FollowingPost';

    useEffect(()=>{
        updateNavInfo({type:'main',titleValue:'팔로우한 게시글',value:{type:'FollowingPost'}})
        queryClient.refetchQueries(['fetchPosts', typeOfFilter]);
    },[queryClient, updateNavInfo, typeOfFilter])

    return(
        <PageNationStandard typeOfFilter={typeOfFilter}></PageNationStandard>
    )
}

export default FollowPost
