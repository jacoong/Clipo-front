import {useContext,useEffect,useState} from 'react';
import LoginForm from '../compoents/LoginForm';
import { useNavigate,Outlet } from 'react-router-dom';

const ValidatePage =() => {



return (
    <div className='flex items-center bg-white w-full h-screen'>
        <div className='mx-auto w-108 h-100 bg-gray-200 rounded'>

        <section className="flex flex-col items-center justify-center w-full h-full bg-slate-500 p-10 rounded-md shadow-none">
                <div className="py-5 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800">등록한 전화번호를 입력해 주세요</h1>
                </div>
                <div className="bg-white py-5 px-10 rounded-md shadow-none w-96">
        <Outlet/>
        </div>
        </section>
        </div>
    </div>
);
}



export default ValidatePage;