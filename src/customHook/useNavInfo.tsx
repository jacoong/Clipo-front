import { useDispatch } from "react-redux";
import { updateNavInfo } from "../store/infoOfNavSlice";
import {navInfoType} from '../store/types';

// 모달 열기 함수의 매개변수 타입 정의


function useNavInfo() {


  const dispatch = useDispatch();
  const handleOpenModal = ({type,titleValue,subTitleValue,value}: navInfoType) => {

    const defaultValue = {
      isReadNumber: 0,
      isBack: false,
    };
  
    // 들어온 value가 있다면 병합, 없으면 기본값만
    const mergedValue = {
      ...defaultValue,
      ...(value ?? {}),
    };
    
    dispatch(updateNavInfo({
        type,
        titleValue,
        subTitleValue: subTitleValue ?? null, // 명시되지 않았다면 기본값 false
        value: value
    }));
  };




  return { updateNavInfo: handleOpenModal};
}

export default useNavInfo;
