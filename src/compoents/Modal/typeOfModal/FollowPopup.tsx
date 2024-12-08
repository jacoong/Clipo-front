import React, {ReactNode} from 'react';
import { useTheme } from '../../../customHook/useTheme';



const FollowPopup =({value}:any) => {
    const {typeOfFilter} = value;
    const { isDark } = useTheme();
    console.log(typeOfFilter);

return (
    <div>
        
    </div>
);
}



export default FollowPopup;