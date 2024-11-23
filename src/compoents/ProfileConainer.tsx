import React, {ReactNode} from 'react';
import {Link} from 'react-router-dom'

interface typeOfProfileContainer {
    profileImg:null|string,
    nickName:string|null
}
const ProfileContainer =({profileImg,nickName}:typeOfProfileContainer) => {

    const profileSrg = profileImg ? profileImg:'/defulat'

return (
    <Link className='shrink-0 relative w-10 h-10 z-10 rounded-full bg-customWhite' to={`/main/@${nickName}`}>
    <img src={profileSrg} className='object-cover w-10 h-10 rounded-full'></img>
    </Link> 
);
}



export default ProfileContainer;