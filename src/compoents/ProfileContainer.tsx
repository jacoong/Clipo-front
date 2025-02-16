import React, {ReactNode,useState,useEffect} from 'react';
import {Link} from 'react-router-dom'
import { FaUserCircle } from "react-icons/fa";

interface typeOfProfileContainer {
    profileImg:string,
    nickName:string|null,
    width?:string,
    height?:string
}
const ProfileContainer =({profileImg,nickName,width='w-10',height="h-10"}:typeOfProfileContainer) => {

 
    let svgColor = "text-gray-300"; // 기본 배경색 (잘못된 값일 경우)
    if(profileImg.startsWith('default_')){
        const num = parseInt(profileImg.replace("default_", ""), 10); 
        switch (num) {
            case 1:
                svgColor = "text-blue-500";
                break;
            case 2:
                svgColor = "text-customGray";
                break;
            case 3:
                svgColor = "text-hovercustomBlack";
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



 
return (
    <Link className={`inline-block shrink-0 relative ${height} ${width}`} to={`/main/@/${nickName}`}>
    {/* <img src={profileImgSrc} className='object-cover w-full h-full rounded-full'></img> */}
    {profileImg?.startsWith("default_") ? (
        <FaUserCircle className={`object-cover w-full h-full rounded-full ${svgColor}`} />
      ) : (
        <img
          src={profileImg}
          className="object-cover w-full h-full rounded-full"
          alt="Profile"
        />
      )}
    </Link> 
);
}




export default ProfileContainer;