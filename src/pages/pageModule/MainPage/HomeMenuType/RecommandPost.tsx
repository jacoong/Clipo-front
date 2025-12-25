import PageNationStandard from "../../pageKit/PageNationStandard.tsx"
import useNavInfo from "../../../../customHook/useNavInfo";
import { useEffect } from "react";
import { useQueryClient } from "react-query";
const RecommandPost = ()=>{
    const { updateNavInfo } = useNavInfo();
    const queryClient = useQueryClient();
    const typeOfFilter = 'MainRandom';
    useEffect(()=>{
    updateNavInfo({type:'main',titleValue:'추천',value:{type:'Recommand'}})
    queryClient.refetchQueries(['fetchPosts', typeOfFilter]);
    },[queryClient, updateNavInfo, typeOfFilter])

    return(
        <PageNationStandard typeOfFilter={typeOfFilter}></PageNationStandard>
    )
}

export default RecommandPost
