import useNavInfo from '../customHook/useNavInfo';
import { useEffect,useState } from 'react';
import {navInfoType} from '../store/types';
import { RootState } from '../store/index';
import {useSelector} from 'react-redux';
const NavMenu = () => {

    const { updateNavInfo } = useNavInfo();
    const infoNav = useSelector((state:RootState) => state.infoNavSlice);



    return (
      <div className="w-full flex justify-between h-24 px-4">
            <div className="ml-2 pr-6 h-full flex items-center">
            <div className="w-12 h-12 justify-center items-center flex">
                <div>a</div>
            </div>
            </div>

            <div className="w-auto h-full flex items-center">
            <p className="p-3 justify-center items-center flex">
            <div>{infoNav.titleValue}</div>
            </p>
            </div>


            <div className="ml-6 pr-2 h-full flex items-center">
            <div className="w-12 h-12 justify-center items-center flex">
                <div>b</div>
            </div>
            </div>
      </div>
        )
    }

export default NavMenu