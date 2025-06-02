import PageNationStandard from "../../pageKit/PageNationStandard.tsx"
import useNavInfo from "../../../../customHook/useNavInfo";
const RecommandPost = ()=>{
    const { updateNavInfo } = useNavInfo();
    updateNavInfo({type:'main',titleValue:'추천',value:{type:'Recommand'}})

    return(
        <PageNationStandard typeOfFilter={'MainRandom'}></PageNationStandard>
    )
}

export default RecommandPost