import PageNationStandard from "../../pageKit/PageNationStandard.tsx";
import useNavInfo from "../../../../customHook/useNavInfo";
const FollowPost = ()=>{

    const { updateNavInfo } = useNavInfo();
    updateNavInfo({type:'main',titleValue:'팔로우한 게시글',value:{type:'FollowingPost'}})


    return(
        <PageNationStandard typeOfFilter={'FollowingPost'}></PageNationStandard>
    )
}

export default FollowPost