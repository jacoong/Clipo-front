import PageNationStandard from "../../pageKit/PageNationStandard.tsx"
import useNavInfo from "../../../../customHook/useNavInfo";
import { useEffect } from "react";
const RecommandPost = ()=>{
    const { updateNavInfo } = useNavInfo();
    useEffect(()=>{
    updateNavInfo({type:'main',titleValue:'추천',value:{type:'Recommand'}})
    },[])

    return(
        <PageNationStandard typeOfFilter={'MainRandom'}></PageNationStandard>
    )
}

export default RecommandPost