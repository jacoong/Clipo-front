import React, { useState } from "react";
import Heart from "react-animated-heart";
import { AiFillHeart,AiOutlineHeart } from "react-icons/ai";

interface typeOfHeartLike {
  isLike: boolean;
  isDark: boolean;
}

export default function HeartLike({ isLike, isDark }: typeOfHeartLike) {
  return (
    isLike ?
    <AiFillHeart className="text-customRed text-lg inline-block align-middle" />
    : 
    <AiOutlineHeart className={`${isDark ? 'text-white' : 'text-black'} text-lg inline-block align-middle`} />
  );
}
