import PageNationStandard from "../../pageKit/PageNationStandard.tsx"
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/index.js'; // 실제 경로에 맞게 수정
import { useEffect,useState } from "react";
import {UserInfo} from '../../../../store/types.js'
import useNavInfo from "../../../../customHook/useNavInfo";
const LikedPost = ()=>{

    const { updateNavInfo } = useNavInfo();
    updateNavInfo({type:'main',titleValue:'좋아한 포스트',value:{type:'LikePost'}})

    const data = useSelector((state: RootState) => state.loginUserInfo);
    const [userInfo,setUserInfo] = useState<undefined|UserInfo>(undefined);
    
    useEffect(()=>{
        if(data !== null){
            setUserInfo(data)
        }
    },[data])
    return(
        userInfo ?
     <PageNationStandard typeOfFilter={'Likes'} username={userInfo.nickName}></PageNationStandard>
     :
     <></>
    )
}

export default LikedPost