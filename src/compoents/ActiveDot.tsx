import React, {ReactNode} from 'react';
import { useTheme } from '../customHook/useTheme';


interface typeOfActiveDot {
    numberOfActive:number
    isShowNumber:boolean
}

const ActiveDot =({numberOfActive,isShowNumber}:typeOfActiveDot) => {
    const { isDark } = useTheme();
    


return (
    
    <div className='bottom-7 left-8 p-1 absolute'>
        {
        isShowNumber ?
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
            <p className="text-white text-xs font-bold">
                {numberOfActive}
            </p>
            </div>
            :
        <div className='w-2 h-2 bg-red-600 rounded-full'></div>
}
    </div>
);
}



export default ActiveDot;