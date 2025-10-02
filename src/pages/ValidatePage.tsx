import {useContext,useEffect,useState} from 'react';
import LoginForm from '../compoents/LoginForm';
import { useNavigate,Outlet } from 'react-router-dom';
import { useTheme } from '../customHook/useTheme';
import { Font_color_Type_1, Bg_color_Type_1 } from '../store/ColorAdjustion';

const ValidatePage =() => {
    const { isDark } = useTheme();

return (
    <div className={`flex items-center w-full h-screen ${isDark ? 'bg-customBlack' : 'bg-white'}`}>
        <div className={`mx-auto w-108 h-100 rounded-lg shadow-lg bg-hovercustomBlack`}>

        <section className={`flex flex-col items-center justify-center w-full h-full p-10 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900`}>
                <div className="py-5 text-center space-y-3">
                    <h1 className="text-3xl font-semibold text-themeColor">전화번호 인증</h1>
                    <p className={`text-lg text-gray-300 font-medium`}>등록한 전화번호를 입력해 주세요</p>
                </div>
                <div className={`bg-gray-800 py-6 px-10 rounded-lg shadow-lg w-96 border border-gray-700`}>
        <Outlet/>
        </div>
        </section>
        </div>
    </div>
);
}


export default ValidatePage;