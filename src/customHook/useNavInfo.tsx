import { useDispatch } from "react-redux";
import { updateNavInfo } from "../store/infoOfNavSlice";
import {navInfoType} from '../store/types';

// 모달 열기 함수의 매개변수 타입 정의


function useNavInfo() {


  const dispatch = useDispatch();
  const handleOpenModal = ({titleValue,subTitleValue,value}: navInfoType) => {
    dispatch(updateNavInfo({
        titleValue,
        subTitleValue: subTitleValue ?? null, // 명시되지 않았다면 기본값 false
        value: value ?? null
    }));
  };




  return { updateNavInfo: handleOpenModal};
}

export default useNavInfo;
