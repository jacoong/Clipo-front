import React, {ReactNode,useState,useEffect} from 'react';
import {Link} from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";

interface typeOfProfileContainer {
    profileImg:string,
    nickName:string,
    width?:string,
    height?:string,
    isClickable?:boolean
}
const ProfileContainer =({isClickable=true,profileImg,nickName,width='w-10',height="h-10"}:typeOfProfileContainer) => {

 
    let svgColor = "text-gray-300"; // 기본 배경색 (잘못된 값일 경우)
    if(profileImg.startsWith('default_')){
        const num = parseInt(profileImg.replace("default_", ""), 10); 
        switch (num) {
            case 1:
                svgColor = "text-blue-500";
                break;
            case 2:
                svgColor = "text-orange-400";
                break;
            case 3:
                svgColor = "text-violet-600";
                break;
            case 4:
                svgColor = "text-customBlue";
                break;
            default:
                svgColor = "text-customBlue";
            }
        }
    else{
        svgColor = "text-customBlue";
    }

    // 공통 스타일 클래스
    const containerClasses = `inline-block shrink-0 relative ${height} ${width}`;
    
    // 공통 프로필 이미지 컴포넌트
    const ProfileImage = () => (
        <>
            {profileImg?.startsWith("default_") ? (
                <FaUserCircle className={`object-cover w-full h-full rounded-full ${svgColor}`} />
            ) : (
                <img
                    src={profileImg}
                    className=" object-cover w-full h-full rounded-full"
                    alt="Profile"
                />
            )}
        </>
    );

    return (
        <>
            {isClickable ? (
                <Link className={containerClasses} to={`/main/@/${nickName}`}>
                    <ProfileImage />
                </Link>
            ) : (
                <div className={containerClasses}>
                    <ProfileImage />
                </div>
            )}
        </>
    );
}

export default ProfileContainer;