import React, { useState, useEffect } from 'react';
import { LuSun } from 'react-icons/lu';
import { MdOutlineNightsStay } from 'react-icons/md';
import {COLOR} from '../store/ThemeColor';
import { useTheme } from '../customHook/useTheme';
const ThemeToggleButton = () => {

    const { isDark, toggleTheme } = useTheme();



    return (
        <div className='absolute bottom-20 right-20'>
        <button
            type="button"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            onClick={toggleTheme}
            className={`group rounded-full ${isDark ? 'bg-zinc-800/90 ring-white/10' : 'bg-white/90 ring-zinc-900/5'} px-5 py-4 shadow-lg shadow-zinc-800/5 backdrop-blur transition ${isDark ? 'dark:hover:ring-white/20' : 'hover:ring-white/20'}`}
        >
            {isDark ? (
                <MdOutlineNightsStay
                    className={`h-6 w-6 fill-${COLOR.customGray} stroke-${COLOR.customWhite} transition group-hover:stroke-${COLOR.hoverLightGray}`}
                />
            ) : (
                <LuSun
                    className={`h-6 w-6 text-${COLOR.customGreen} transition group-hover:fill-${COLOR.customBlack} group-hover:stroke-${COLOR.customBlack}`}
                />
            )}
        </button>
        </div>
    );
};

export default ThemeToggleButton;